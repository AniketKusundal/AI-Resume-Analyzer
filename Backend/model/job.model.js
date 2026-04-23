const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },

    company_name : {
        type :String,
        required :true,
        trim : true,
    },

    role :{
        type: String,
        required :true,
        trim:true
    },

    apply_status : {
        type :String,
        enum :["Applied" , "Interview" , "Rejected" , "Pending"],
        default: "Applied",
    },

    appliedDate : {
        type : Date,
        default :Date.now(),
    },

    note : {
        type :String,
    },
},
    {timestamps :true}
)

const Job = mongoose.model("job" , JobSchema)

module.exports = Job;