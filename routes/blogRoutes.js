const express=require('express');
const app=express.Router();
const Blog=require('../models/blogModel');
const fs=require('fs');
const mime=require('mime-types');

const validImageFormats = ['image/jpeg', 'image/jpg', 'image/png'];

//Blog Routes
app.get('/get-blogs',async(req,res)=>{
    try{
        const blogs=await Blog.find();
        res.status(200).json(blogs);
    }
    catch(err){
        res.status(400).json(err);
    }
});
app.post('/post-blog/:userId',async(req,res)=>{
    try{
        const uid=req.params.userId;
        const {title,description,category}=req.body;
        const imagepath='D:/Complete Web Development/Blogging/backend/p.jpg';
        const imageBuffer=fs.readFileSync(imagepath);
        //const imageType = imagepath.split('.').pop().toLowerCase();
        const imageType=mime.lookup(imagepath);

        if(!validImageFormats.includes(imageType)){
            return res.status(400).json("Invalid Image Format");
        }
        const blog=new Blog({
            title: title,
            description: description,
            createdBy:uid,
            category:category.toLowerCase(), 
            image:imageBuffer,
            imageType:imageType
        });
        await blog.save();
        res.status(200).json("Blog Posted Successfully");   
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
//Update-blogs
app.patch('/edit-blog-title/:p',async(req,res)=>{
    try{
        const bid=req.params.p;
        const {title}=req.body;
        const blog=await Blog.findOne({_id:bid});
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            blog.title=title;
            await blog.save();
            res.status(200).json("Title Updated Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.patch('/edit-blog-description/:p',async(req,res)=>{
    try{
        const bid=req.params.p;
        const {description}=req.body;
        const blog=await Blog.findOne({_id:bid});
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            blog.description=description;
            await blog.save();
            res.status(200).json("Description Updated Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.patch('/edit-blog-image/:p',async(req,res)=>{
    try{
        const bid=req.params.p;
        const blog=await Blog.findOne({_id:bid});
        const imagepath='D:/Complete Web Development/Blogging/backend/p.jpg';
        const imageBuffer=fs.readFileSync(imagepath);
        //const imageType = imagepath.split('.').pop().toLowerCase();
        const imageType=mime.lookup(imagepath);
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            if(!validImageFormats.includes(imageType)){
                return res.status(400).json("Invalid Image Format");
            }
            else{
                blog.image=imageBuffer;
                blog.imageType=imageType;
                await blog.save();
                res.status(200).json("Image Updated Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
//delete-blog
app.delete('/delete-blog/:blogId',async(req,res)=>{
    try{
        const bid=req.params.blogId;
        const {userId}=req.body;
        const blog=await Blog.findOne({_id:bid,createdBy:userId});
        console.log(blog);
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            await blog.deleteOne();
            res.status(200).json("Blog Deleted Successfully");
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//pagination filtering

app.get('/get-blogs/:category',async(req,res)=>{
    try{
        const category=req.params.category;
        const blogs=await Blog.find({category:category});
        res.status(200).json(blogs);
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.get('/paginated-blogs',async(req,res)=>{
    try{
       const blog=await Blog.find().sort({createdAt:-1}).limit(20);
       res.status(200).json(blog);  
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});

//More Routes To Be Implemented

app.post('comment-blog/:blogId',async(req,res)=>{
    try{
        const bid=req.params.blogId;
        const {userId,comment}=req.body;
        const blog=Blog.findOne({_id:bid});
        console.log(blog);
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            blog.comments.push({user:userId,comment:comment});
            await blog.save();
            res.status(200).json("Commented Successfully");
        }
    }
    catch(err){
        res.status(400).json(err);
    }
});
app.post('/like-blog/:blogId',async(req,res)=>{
    try{
        const bid=req.params.blogId;
        const {userId}=req.body;
        const blog=await Blog.findOne({_id:bid});
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            const existingRating=blog.rating.find((r)=>r.user===userId);
            if(existingRating){
                res.status(400).json("You have already Rated this blog");
            }
            else{
                blog.rating.push({user:userId});
                await blog.save();
                res.status(200).json("Blog Liked Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});
app.delete('/unlike-blog/:blogId',async(req,res)=>{
    try{
        const bid=req.params.blogId;
        const {userId}=req.body;
        const blog=await Blog.findOne({_id:bid});
        if(!blog){
            res.status(400).json("Blog does not exist");
        }
        else{
            const existingRating=blog.rating.find((r)=>r.user===userId);
            if(!existingRating){
                res.status(400).json("You have not Liked this blog");
            }
            else{
                blog.rating=blog.rating.filter((r)=>r.user!==userId);
                await blog.save();
                res.status(200).json("Blog Unliked Successfully");
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);
    }
});



module.exports=app;