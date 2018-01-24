const _ = require('lodash');
const Path = require('path-parser');
const {URL} = require('url'); //helper comes with node.js for parsing urls
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

//we do it this way to avoid problems in testing if we required directly from model folder
const Survey = mongoose.model('surveys');

module.exports= (app)=>{
    app.get('/api/survey/:surveyId/:choice', (req,res)=>{
        res.send('Thanks for voting!');
        
    })

    app.get('/api/surveys', requireLogin, async (req,res)=>{
        //we dont need all the data in this collection so lets get speacific
        //we can chain queries to our original mongoose query
        const surveys = await Survey.find({_user:req.user.id})
            .select({recipients:false});   //1 include 0 exclude. its somewhat like true or false. we are excluding the recipients sub document

        res.send(surveys);
    });
    
    
    app.post('/api/surveys', requireLogin, requireCredits, async (req,res)=>{
        const {title, subject, body, recipients} = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => { return {email:email.trim()}}),
            _user:req.user.id,
            dateSent: Date.now()
        });

        //send email
        const mailer = new Mailer(survey, surveyTemplate(survey));
        
        try{
            await mailer.send();
            
            //save survey
            await survey.save();
            //remove one credit
            req.user.credits -= 1;
            var user = await req.user.save();
            res.send(user);
        }catch(err){
            res.status(422).send(err);
        }

    })

    app.post('/api/surveys/webhooks', (req,res)=>{
        const p = new Path('/api/surveys/:surveyId/:choice');
        
        // const events = _.map(req.body, (event)=>{
        //     //lets extract the route only
        //     const pathname = new URL(event.url).pathname; //exrtracts the url only. code can be nested in the match function below
        //     const match = p.test(pathname); //either object or null
        //     if(match){
        //         return {email:event.email, surveyId:match.surveyId, choice:match.choice};
        //     }
        // })
        //to remove any undefined elements we use a lodash helper called conpact
        // const compactEvents = _.compact(events);
        // const uniqueEvents = _.uniqBy(compactEvents,'email','surveyId'); //removes duplicates

        //lets refactor the code above using the lodash chain function
         _.chain(req.body)
            .map(({email,url})=>{
                const match = p.test(new URL).pathname;
                if(match){
                    return {email:match.email, surveyId:match.surveyId, choice:match.choice};
                }
            })
            .compact() //remove undefined
            .uniqBy('email','surveyId') //remove duplicates
            .each(({surveyId, email, choice})=>{
                Survey.updateOne({ //find and update a record
                    _id:surveyId,
                    recipients:{
                        $elemMatch:{email:email, responded:false} //this is the match query
                    }
                },{ //this is the update. this entire query runs in the database without loading to express
                    $inc:{ [choice] : 1 }, //this is a mongo operator. This allows us put an operator inside a query. inc means increment. [choice] key interpolation
                    $set:{'recipients.$.responded':true}, //setting the responded field of the sub document collection
                    lastResponded: new Date()
                }).exec(); //executes and sends off to the database
            })
            .value(); //this is the return statement

        

        res.send({});
    })
};