const express = require('express')
const router = express.router();

const user = require('./../Models/userSchema');

router.post('/signup',async (req,res)=>{
    try{
        const data = req.body;
        const userData = new user(data);
        const responce = await userData.save();
        console.log('data is saved');
        res.status(200).json(responce);
    }catch(err){
        console.error(err);
        res.status(401).json({error:'error has occured'});
    }

});

router.post('/login',async (req,res)=>{
    try{
        const data = req.body;
        const userData = new user(data);
        const responce = await userData.save();
        console.log('data is saved');
        res.status(200).json(responce);
    }catch(err){
        console.error(err);
        res.status(401).json({error:'error has occured'});
    }
})
