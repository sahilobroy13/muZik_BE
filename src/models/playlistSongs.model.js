const mongoose = require("mongoose");

const playlistSongSchema = new mongoose.Schema({
    playlistId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "playlist",
    },
    songId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
    },
    
})
playlistSongSchema.index(
  { playlistId: 1, songId: 1 },
  { unique: true }
);

const playlistSongModel = mongoose.model("playlistSong", playlistSongSchema);
module.exports = playlistSongModel;