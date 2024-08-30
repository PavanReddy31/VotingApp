const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    mobile:{
        type:String,
        require:true
    },
    aadharNumber:{
        type:String,
        require:true,
        unique:true
    },
    city:{
        type:String,
        require:true
    },
    pincode:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    voteStatus:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save',async function(next){
    const user = this;

    if(!user.isModified('password'))
        return next();

    try{
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.comparePasswords = async function(givenPassword){
    try{
        console.log('Given Password:', givenPassword);  // Log the password provided by the user
        console.log('Stored Password:', this.password); 
        const isMatch = await bcrypt.compare(givenPassword,this.password);
        return isMatch;
    }catch(err){
        throw(err);
    }
}


const userModel = mongoose.model('userModel',userSchema);
module.exports = userModel;

