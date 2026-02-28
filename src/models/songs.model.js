const mongoose = require("mongoose");

const songSchema =  new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    artist_id : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "User"
    },
    // album_id : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Album"
    // },
    duration : {
        type : Number,
        required : true
    },
    song_url : {
        type : String,
        required : true,
    },
    cover : {
        type : String,
        required : true
    }
})

const songModel = mongoose.model("Song" , songSchema);

module.exports = songModel;