const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    grade: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    profilePic: {
    type: String,
    default: ""
    },

   qrCode: {
    type: String,
    default: ""
    },

    schoolYear:{
    type:String,
    default:"2026-2027"
},

    status:{

    type:String,

    default:"Active"
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Student", studentSchema);