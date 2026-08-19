const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    schoolName: {
        type: String,
        default: ""
    },

    schoolYear: {
        type: String,
        default: ""
    },

    morningIn: {
        type: String,
        default: "07:00"
    },

    morningLate: {
        type: String,
        default: "07:30"
    },

    morningOut: {
        type: String,
        default: "12:00"
    },

    afternoonIn: {
        type: String,
        default: "13:00"
    },

    afternoonLate: {
        type: String,
        default: "13:30"
    },

    afternoonOut: {
        type: String,
        default: "17:00"
    }

});

module.exports = mongoose.model("Setting", settingsSchema);