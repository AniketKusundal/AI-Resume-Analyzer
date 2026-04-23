const mongoose = require('mongoose')



const ResumeSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required :true,
    },

    fileUrl : {
        type :String, // claudinary URL
        required :true,

    },


    atsScore : {
        type : Number,
    },

    extactedText : {
        type :String,
    },

    aiFeedback : {
        type : mongoose.Schema.Types.Mixed,
    },

},
    {timestamps : true}
)

const Resume = mongoose.model("resume" , ResumeSchema)

module.exports = Resume;