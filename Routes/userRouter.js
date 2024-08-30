const express = require('express')
const router = express.Router();
const {jwtMiddleware,generateToken} = require('./../jwt');
const user = require('./../Models/userSchema');

router.post('/signup',async (req,res)=>{
    try{
        const data = req.body;//extract the user info 

        const userData = new user(data);//create new user document using mongoose model

        const responce = await userData.save();//save into database
        console.log('data is saved');

        const payload = {
            id:responce.id//not taking any risk by giving aadhar in payload since if any one gets token risk of exposing aadhar increase
        }

        console.log(JSON.stringify(payload));//convert the jvascript object or array into json string

        const token = generateToken(payload);//generate the token

        console.log('token is : ',token);
        res.status(200).json({responce:responce,token:token});

    }catch(err){
        console.error(err);
        res.status(401).json({error:'error has occured'});
    }

});

router.post('/login',async (req,res)=>{
    try{
        const {aadharNumber,password} = req.body;

        const userInfo = await user.findOne({aadharNumber:aadharNumber});

        if(!userInfo || !(await userInfo.comparePasswords(password)))
            return res.status(401).json({message:'invalid aadhar or password'});

        console.log('data is fetched');

        const payload = {
            id:userInfo.id
        }

        const token = generateToken(payload);

        res.status(200).json({userInfo:userInfo,token:token});
    }catch(err){
        console.error(err);
        res.status(401).json({error:'error has occured'});
    }
});

router.get('/profile',jwtMiddleware,async (req,res)=>{
    try{
        const userId = req.user; // get info from req.user which was stored in bcrypt.verify

        const id = userId.id; // get id 

        const responce = await user.findById(id);

        console.log('got the data');
        res.status(200).json(responce);
    }catch(err){
        console.error(err);
        res.status(500).json({err:'there is an error'});
    }

});

router.put('/profile/changePassword',jwtMiddleware,async (req,res)=>{
    try{
        const userId = req.user; // since we already logged we are using the same userId

        const user = await user.findById(userId); // get the user details

        const {currentPassword,newPassword} = req.body; //current password should be entered because he already logged 

        if(!(await user.comparePasswords(currentPassword)))
            return res.status(401).json({err:'password is incorrect'});

        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message:'password updated'});
    }catch(err){
        res.status(401).json({message:'error'});
    }
})

// router.post('/cahngePassword/:aadhar',async (req,res)=>{
//     const id = req.params.aadhar;
//     const changedPassword = req.body;
//     const userInfo = await user.findById({id:id});
//     if(!userInfo)
//         res.status(401).json({err:'user not found'});

//     userInfo.password = changedPassword;
//     await userInfo.save();
// })


router.get('/',async (req,res)=>{
    try{
        const data = await user.find();
        res.status(200).json(data);
    }catch(err){
        console.error(err);
        res.status(404).json({err:"no data is found"})
    }
})

module.exports = router;
