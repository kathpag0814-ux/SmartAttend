const express=require("express");

const router=express.Router();

const Setting=require("../models/settings");

router.get("/",async(req,res)=>{

let setting=await Setting.findOne();

if(!setting){

setting = await Setting.create({

    schoolName: "",

    schoolYear: "",

    morningIn: "07:30",

    morningOut: "11:35",

    afternoonIn: "1:00",

    afternoonOut: "4:00",

    lateTime: "07:30"

});
}

res.json(setting);

});

router.put("/",async(req,res)=>{

let setting=await Setting.findOne();

if(!setting){

setting=new Setting(req.body);

}else{

Object.assign(setting,req.body);

}

await setting.save();

res.json({

success:true

});

});

module.exports=router;