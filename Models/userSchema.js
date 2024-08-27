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
        type:String,
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
        type:boolean,
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
        const isMatch = await bcrypt.compare(givenPassword,this.password);
        return isMatch;
    }catch(err){
        throw(err);
    }
}


const model = mongoose.model('model',userSchema);
module.exports = model;

