const mongoose=require('mongoose');

const activationTokenSchema=new mongoose.Schema({
          verificationLink: { type: String, required: true }
});

const userSchema=new mongoose.Schema({  
     fullname:{ type: String, required: true },
     email:{ type: String, required: true,unique:true },
     password:{ type: String, required: true },
     token:{ type: String,required:true},
     followers:[{user:{ type:mongoose.Schema.Types.ObjectId, ref:'User'}}],
     following:[{user:{ type:mongoose.Schema.Types.ObjectId, ref:'User'}}],
     image:{type:Buffer},
     BlockedUsers:[{user:{ type:mongoose.Schema.Types.ObjectId, ref:'User'}}],
     isActive:{type:Boolean,default:false},
     activationToken:{type:activationTokenSchema}
});

module.exports=mongoose.model('User',userSchema);