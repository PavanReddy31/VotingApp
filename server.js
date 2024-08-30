const express = require('express');
const app = express();
//const passport = require('./passport');
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const Port = process.env.Port || 3000;

// app.use(passport.initialize());
// const localAuthorization = passport.authenticate('local',{session:false});

const userRouter = require('./Routes/userRouter');
app.use('/user',userRouter);

const candidateRouter = require('./Routes/candidateRouter');
app.use('/candidates',candidateRouter);



app.listen(Port,()=>{
    console.log('listening on port 3000');
})