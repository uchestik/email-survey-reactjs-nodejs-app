const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

//we use this instead of a require statement to 
//prevent errors in the testing environment 
const User = mongoose.model('users');

//the user here is the found user
//done is a callback for passport
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//the first argument is the id that was stuffed in the cookie
passport.deserializeUser((id,done)=>{
    User.findById(id)
        .then(user =>{
            done(null, user);
        })
});

//New googlestrategy creates a new instance of google
//this is indeed a constructor that sets our configuration
//we need to manually specify the callback routh that google
//responds to with the identification code.

passport.use(new GoogleStrategy({
    clientID:keys.googleClientID,
    clientSecret:keys.googleClientSecret,
    callbackURL:'/auth/google/callback',
    proxy:true
}, (accessToken, refreshToken, profile, done)=>{
    // console.log('access token', accessToken);
    // console.log('refresh token', refreshToken);
    // console.log('profile', profile);

    User.findOne({googleId:profile.id})
        .then((existingUser)=>{
            if(existingUser){
                //done takes an error and foundItem object
                done(null, existingUser);
            }else{
                new User({googleId:profile.id}).save()
                    .then(user=>done(null, user));
            }
        });
})
);