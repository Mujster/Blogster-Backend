const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type:mongoose.Schema.Types.ObjectId, ref:'User',required:true },
    comment:{ type: String, required: true },
});

const ratingSchema = new mongoose.Schema({
    user: { type:mongoose.Schema.Types.ObjectId, ref:'User',required:true },
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type:mongoose.Schema.Types.ObjectId, ref:'User',required:true },
    category:{type:String,required:true},
    comments: [commentSchema],
    rating: [ratingSchema],
    image:{type:Buffer},
});

module.exports = mongoose.model('Blog', blogSchema);    
