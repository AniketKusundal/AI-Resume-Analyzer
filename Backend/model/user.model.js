const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({

    first_name : {
        type :String,
        required : true,
        trim :true,
    },

    last_name : {
        type : String,
        required :true,
        trim :true,
    },

    email : {
        type :String,
        required :true,
        unique : true,
        lowercase : true,
        trim :true,
    },

    password : {
        type :String,
        required : true,
        minLength : 6,
    
    },


    role : {
        type :String,
        enum : ["USER" , "ADMIN"],
        default : "USER",
    },
}, 

{timestamps :true})


const User = mongoose.model('user' , UserSchema);

module.exports = User;