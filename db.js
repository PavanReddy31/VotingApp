const mongoose = require('mongoose');
require('dotenv').config();

//const mongoose_url = process.env.mongoose_url;
const mongoose_url = 'mongodb://localhost:27017/Voting_app'

mongoose.connect(mongoose_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('database is connected')
});

db.on('disconnected',()=>{
    console.log('database is disconnected')
});
db.on('error',()=>{
    console.log(err,'there is an error')
});

module.exports = db;
