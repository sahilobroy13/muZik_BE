const mongoose = require("mongoose");


async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully!");
    }catch(err){
        console.log("Something went wrong while connectin database !", err);
    }
}

module.exports = connectDb; 