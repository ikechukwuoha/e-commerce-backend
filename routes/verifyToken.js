const jwt = require("jsonwebtoken");



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader){
        jwt.verify(token, process.env.JWT_SEC, (err,user)=> {
            if(err) return res.status(403).json("Invalid Token!");
            req.user = user;
            next()
        })
    }else{
        return res.status(401).json("User not Authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next)=>{
    verifyToken(req, res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()   
        }else{
            res.status(403).json("You do not have adequate permision to carry out this operation!");
        }
    });
};

module.exports = {verifyToken, verifyTokenAndAuthorization};