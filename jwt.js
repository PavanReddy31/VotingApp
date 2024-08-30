const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{
    const auth = req.headers.authorization
    if(!auth)
        res.status(401).json({message:'no authorization token given'});
    const token = req.headers.authorization.split(' ')[1];
    if(!token)
        return res.status(401).json({err:'token error'});
    try{
        const decoded = jwt.verify(token,process.env.jwt_token_secret);
        req.user = decoded;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({err:'something went wrong'});
    }
};

const generateToken = (userData)=>{
    return jwt.sign(userData,process.env.jwt_token_secret);
}

module.exports = {jwtMiddleware,generateToken};