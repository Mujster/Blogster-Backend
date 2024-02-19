const express = require('express');
const app=express.Router(); 
const User = require('../models/userModel');
const mime=require('mime-types');

const validImageFormats = ['image/jpeg', 'image/jpg', 'image/png'];

//get all users
app.get('/get-user',async(req,res)=>{
    try{
        const user=await User.find();
        if(!user){
            res.status(404).json("No Users Found");
        }
        else{
        res.status(200).json(user);
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//get user by id
app.get('/get-user/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            res.status(200).json(user);
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//follow user
app.post('/follow-user/:userId',async(req,res)=>{  
    try{
        const uid=req.params.userId;
        const {followId}=req.body;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            const existingFollow=user.following.find((f)=>f.user===followId);
            if(existingFollow){
                res.status(400).json("You are already following this user");
            }
            else{
                user.following.push({user:followId});
                await user.save();
                res.status(200).json("User Followed Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//unfollow user
app.post('/unfollow-user/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const {followId}=req.body;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            const existingFollow=user.following.find((f)=>f.user===followId);
            if(!existingFollow){
                res.status(400).json("You are not following this user");
            }
            else{
                user.following=user.following.filter((f)=>f.user!==followId);
                await user.save();
                res.status(200).json("User Unfollowed Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//remove follower
app.post('/remove-follower/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const {followId}=req.body;
        const user=await User.findOne({_id:uid});   
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            const existingFollower=user.followers.find((f)=>f.user===followId);
            if(!existingFollower){
                res.status(400).json("This user is not following you");
            }
            else{
                user.followers=user.followers.filter((f)=>f.user!==followId);
                await user.save();
                res.status(200).json("Follower Removed Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//get followers
app.get('/get-followers/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            res.status(200).json(user.followers);
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
}); 

//get following
app.get('/get-following/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            res.status(200).json(user.following);
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//block user
app.post('/block-user/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const {blockId}=req.body;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            const existingBlock=user.BlockedUsers.find((b)=>b.user===blockId);
            if(existingBlock){
                res.status(400).json("User is already blocked");
            }
            else{
                user.BlockedUsers.push({user:blockId});
                await user.save();
                res.status(200).json("User Blocked Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//unblock user
app.post('/unblock-user/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const {blockId}=req.body;
        const user=await User.findOne({_id:uid});
        if(!user){
            res.status(404).json("User Not Found");
        }
        else{
            const existingBlock=user.BlockedUsers.find((b)=>b.user===blockId);
            if(!existingBlock){
                res.status(400).json("User is not blocked");
            }
            else{
                user.BlockedUsers=user.BlockedUsers.filter((b)=>b.user!==blockId);
                await user.save();
                res.status(200).json("User Unblocked Successfully");
            }

        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//change profile image
app.patch('/add-image/:userId',async(req,res)=>{
   try{
      const uid=req.params.userId;
      const imagepath='D:/Complete Web Development/Blogging/backend/p.jpg';
      const imageBuffer=fs.readFileSync(imagepath);
      //const imageType = imagepath.split('.').pop().toLowerCase();
      const imageType=mime.lookup(imagepath);
      const user=await User.findOne({_id:uid});
      if(!user){
          res.status(404).json("User Not Found");
      }
      else{
            if(!validImageFormats.includes(imageType)){
                return res.status(400).json("Invalid Image Format");
            }
            user.image=imageBuffer;
            user.imageType=imageType;
            await user.save();
            res.status(200).json("Image Added Successfully");
      }
   }
   catch(err){
    console.log(err);
    res.status(400).json(err);
   }
});

module.exports=app; 