const passport = require('passport');


//this route kicks in our authentication flow
//it can be whatever you want it to be 
//scope tells google what access we want. look up entire scope list
//google responds with code in query string
module.exports = (app)=>{
    app.get('/auth/google', passport.authenticate('google',{
        scope:['profile','email']
    })
    );

    //this is the callback route that handles the query string
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req,res)=>{
            res.redirect('/surveys');
        }
    );

    app.get('/api/logout', (req,res)=>{
        req.logout(); //this kills the cookie id
        res.redirect('/');
    })
    app.get('/api/currentuser', function(req,res){
        res.send(req.user);
    });
};
