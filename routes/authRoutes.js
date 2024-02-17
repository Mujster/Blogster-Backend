const express = require('express');
const app = express.Router(); 
const User=require('../models/userModel'); 
const bcryptjs=require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

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
                    user.set('token',token);
                    await user.save().then(()=>console.log("User Registered Successfully")).catch((err)=>console.log("Error in registering user",err));     
                }
            });
            res.status(200).json("User Registered Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.post('/authenticate',async(req,res)=>{
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
                bcryptjs.compare(password,existingUser.password,(err,result)=>{
                    if(err){
                        res.status(400).json("Error in comparing password");
                        console.log(err);
                    }
                    else{
                        if(result){
                            res.status(200).json("User Authenticated Successfully");
                            const token=jwt.sign({email:email},SECRETKEY,{expiresIn:'1h'});
                            existingUser.updateOne({$set:{token:token}});
                            existingUser.save();
                        }
                        else{
                            res.status(400).json("Invalid Password");
                        }
                    }
                });
                //localStorage.setItem('token',token);
            }
        }
    }
    catch(err){
        res.status(400).json(err);
    }
});


module.exports = app;