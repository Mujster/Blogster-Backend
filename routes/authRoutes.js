const express = require('express');
const app = express.Router(); 
const User=require('../models/userModel'); 
const bcryptjs=require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');
const dotenv = require('dotenv');
const VerifyToken=require('../middlewares/authentication');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

const senderEmail=process.env.SENDEREMAIL;
const authenticationCode=process.env.AUTHENTICATIONCODE;    

const transporter=nodemailer.createTransport({  
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:true,
    auth:{
        user:senderEmail,
        pass:authenticationCode,
    }
});

const SECRETKEY=process.env.SECRETKEY||'mysecretkey';

//Login Routes
app.post('/register',async(req,res)=>{
    try{
        const {fullname,email,password}=req.body;
        const existingUser=await User.findOne({email:email});
        if(existingUser){
            res.status(400).json("User already exists");
        }
        else{
            const user=new User({fullname:fullname,email:email});
            bcryptjs.hash(password,10,async(err,hash)=>{
                if(err){
                    res.status(400).json("Error in hashing password");
                }
                else{
                    user.set('password',hash);
                    const token=jwt.sign({email:email},SECRETKEY,{expiresIn:'1h'});
                    res.setHeader('Set-Cookie',cookie.serialize('token',token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60*60,
                        path: '/',
                    }));
                    const verifyLink=`http://localost:3001/blogster/verify-email?token=${token}`;
                    const activationToken={verificationLink:verifyLink};
                    const mailOptions={
                        from:'<noreply>activationmail.blogster@gmail.com',
                        to:email,
                        subject:'Blogster Email Verification',
                        html: `<p>Please click on the following button to verify your email address:</p>
                               <a href="${verifyLink}" style="text-decoration: none;">
                               <button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 12px;">Verify</button>
                               </a>`,
                    };
                    transporter.sendMail(mailOptions,(err,info)=>{
                        if(err){
                            console.log(err);
                            res.status(400).json("Error in sending email");
                        }
                        else{
                            console.log("Email Sent",info.response);
                        }
                    });
                    user.set('token',token);
                    user.set('activationToken',activationToken);
                    await user.save().then(()=>console.log("User Registered Successfully")).catch((err)=>console.log("Error in registering user",err));     
                    res.status(200).json("User Registered Successfully");
                }
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.post('/authenticate',VerifyToken,async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            res.status(400).json("Please fill all the fields");
        }
        else{
            const existingUser=await User.findOne({email:email});
            if(!existingUser){
                res.status(400).json("User does not exist");
            }
            else{
                if(!existingUser.isActive){
                    return res.status(400).json("Account Not Verified Yet. Please Verify Your Email First.");
                }
                else{
                bcryptjs.compare(password,existingUser.password,(err,result)=>{
                    if(err){
                        res.status(400).json("Error in comparing password");
                        console.log(err);
                    }
                    else{
                        if(result){
                            const token=jwt.sign({email:email},SECRETKEY,{expiresIn:'1h'});
                            existingUser.updateOne({$set:{token:token}});
                            existingUser.save();
                            res.setHeader('Set-Cookie',cookie.serialize('token',token, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'strict',
                                maxAge: 60*60,
                                path: '/',
                            }));
                            res.status(200).json("User Authenticated Successfully");
                            return;
                        }
                        else{
                            return res.status(400).json("Invalid Password");
                        }
                        return res.status(200).json("User Authenticated Successfully");
                    }
                });
                //localStorage.setItem('token',token);
               }
           }
        }
    }
    catch(err){
        res.status(400).json(err);
    }
});
app.get('/blogster/verify-email',async(req,res)=>{
    try{
        const token=req.query.token;
        const user=await User.findOne({token:token});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            if(user.isActive){
               return res.status(400).json("Email Already Verified");
            }
            user.set('isActive',true);
            user.save();
            res.status(200).json("Email Verified Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.post('/logout',VerifyToken,async(req,res)=>{
    try{
        const token=req.cookies.token;
        const user=await User.findOne({token:token});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            user.set('token','');
            user.save();
            res.setHeader('Set-Cookie',cookie.serialize('token','', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: -1,
                path: '/',
            }));
            res.status(200).json("User Logged Out Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = app;