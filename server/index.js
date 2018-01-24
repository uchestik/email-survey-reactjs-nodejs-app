const express = require('express');
const mongoose = require ('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const bodyParser = require('body-parser');


require('./models/User');
require('./models/Survey');
//because we are not assigning anything 
//to this file we can simply just require it
require('./services/passport');

mongoose.connect('mongodb://localhost/emailApp');

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys:[keys.cookieKey]
    })
);

//now lets get passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

//because we export this as a function we have to execute this function
//this is an immediately invoked function 
//this is a simple way to connect app on two files
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

//server side rendering
//when a route comes in that is not defined in our Api
//kick back to main.js file.
//run this only in production
if(process.env.NODE_ENV === 'production'){
    //express will serve up production assets 
    //like main.js or main.css
    app.use(express.static('client/build'));

    //express will serve up index.html file if it does not 
    //recognize the route
    //if route is not in required,express.static then serve up index.html
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
    })

}






const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("app running on port 5000");
});