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
});

// to get the list of candidates

router.get('/',jwtMiddleware,async (req,res)=>{
    try{
        const data = await candidate.find();
        res.status(200).json(data);
    }catch(err){
        console.error(err);
        res.status(404).json({err:'no data found'});
    }
});

// voting starts

router.post("/vote/:candidateId",jwtMiddleware,async (req,res)=>{
    // get candidate id and user id
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    try{
        const Candidate = await candidate.findById(candidateId);
        if(!Candidate)
            return res.status(404).json({err:"candidate not found"});
        const User = await user.findById(userId);
        if(!User)
            return res.status(400).json({err:"user not found"});

        // check if he has voted already
        if(User.voteStatus == true)
            return res.status(400).json({err:"not allowed to vote more than once"});
        // check if he is admin or voter
        if(User.role == 'admin')
            return res.status(403).json({err:"admin is not allowed to vote"});

        // update the user document
        User.voteStatus = true;
        await User.save();

        // update the candidate profile 
        Candidate.votes.push({User:userId});
        Candidate.voteCount++;
        await Candidate.save(); 

        res.status(200).json(Candidate);

    }catch(err){
        console.error(err);
        re.status(403).json({err:'internal server error'});
    }
})


// display vote count of every party in descending order

router.get('/vote/count',async (req,res)=>{
    // get the data in descending order of votcount of respective party
    const Candidate = await candidate.find().sort({voteCount:'desc'});

    // now map only party name, candidate name and vote count to display 
    const voteRecord = await Candidate.map((data)=>{
        return{
            name:data.name,
            party:data.party,
            vote:data.voteCount
        }
    });
    res.status(200).json(voteRecord);
})

module.exports = router;