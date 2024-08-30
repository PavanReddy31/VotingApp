const express = require('express');
const router = express.Router();
const candidate = require('../Models/candidateSchema')
const user = require('./../Models/userSchema')
const {jwtMiddleware} = require("./../jwt");
const { VirtualType } = require('mongoose');

const checkAdmin = async (userId)=>{
    try{
        const I_user = await user.findById(userId);
        return I_user.role === 'admin';
    }catch(err){
        return false;
    } 
}


router.post('/',jwtMiddleware,async (req,res)=>{
    try{

        if(! await checkAdmin(req.user.id))
            return res.status(403).json({err:'you are not admin to access this'});

        const data = req.body;
        const newCandidate = new candidate(data);
        const responce = await newCandidate.save();
        console.log('New candidate has been added');
        res.status(200).json(responce);
    }catch(err){
        console.error(err);
        res.status(401).json({err:'there is an error'});
    }
});

router.put('/:candidateId',jwtMiddleware,async (req,res)=>{
    try{

        if(!checkAdmin(req.user.id))
            return res.status(403).json({err:'you are not admin to access this'});

        const id = req.params.candidateId;
        const data = req.body;
        const responce = await candidate.findById(id,data,{
            new : true, // returns the updated document
            runValidators:true // to run validators to check if everything is matching with schema
        });
        if(!responce)
           return res.status(401).json({err:'something wrong with updated schema'});

        console.log('data is updated');
        res.status(200).json(responce);

    }catch(err){
        console.error(err);
        res.status(401).json({err:'there is an error'});
    }

});


router.delete('/:candidateId',jwtMiddleware,async (req,res)=>{
    try{

        if(!checkAdmin(req.user.id))
            return res.status(403).json({err:'you are not admin to access this'});

        const id = req.params.candidateId;
        const responce = await candidate.findByIdAndDelete(id);
        if(!responce)
            return res.status(401).json({err:'data with this id is not found'})

        res.status(200).json(responce);
    }catch(err){
        console.error(err);
        res.status(401).json({err:'there is an error'});
    }
})




module.exports = router;