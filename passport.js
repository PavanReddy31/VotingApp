const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const user = require('./Models/userSchema')

passport.use(new localStrategy(async (aadharNumber,password,done)=>{
    try{
        const aadhar = await user.findOne({aadharNumber:aadharNumber});
        if(!aadhar) 
            return done(null,false,{message:'aadhar not found'});
        const isPasswordMatch = aadhar.comparePasswords(password);
        if(!isPasswordMatch)
            return done(null,false,{message:'password is wrong'});
        else
            return done(null,user);
    }catch(err){
        done(err);
    }
   
}));

module.exports = passport;