const jwt=require('jsonwebtoken');

const VerifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(403).json("User not authenticated");
    }
    jwt.verify(token,process.env.SECRETKEY,(err,user)=>{
        if(err){
            return res.status(403).json("Invalid Token");
        }
        else{
            req.user=user;
            next();
            //return res.status(200).json("User Authenticated Successfully");
        }
    });
};

module.exports=VerifyToken;