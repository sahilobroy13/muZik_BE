const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password :{
        type : String,
        require : true,
    },
    role : {
        type : String,
        enum : ["Artist" , "User"],
        default : "User"
    }

})

const userModel = mongoose.model("User" , userSchema);

module.exports = userModel;