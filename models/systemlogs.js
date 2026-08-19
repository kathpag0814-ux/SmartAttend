const mongoose=require("mongoose");

const systemLogSchema=new mongoose.Schema({

activity:{
type:String,
required:true
},

description:{
type:String,
required:true
},

status:{
type:String,
default:"Success"
}

},{
timestamps:true
});

module.exports=mongoose.model("SystemLog",systemLogSchema);