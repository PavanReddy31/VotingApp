const mongoose = require('mongoose');

const candSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    party:{
        type:String,
        require:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'userSchema',
                require:true
            },
            votedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0   
    }
});

const model = mongoose.model('model',candSchema);
module.exports = model;