const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required for playlist creation."],
    trim : true,
    maxlength : [50, "Playlist name cannot exceed 50 characters."]
  },
  description: {
    type: String,
    trim : true,
    maxlength : [500, "Description cannot exceed 500 characters."],
    default : null
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required for playlist creation."],
  },
  visibility: {
    type: String,
    enum : [ "PUBLIC" , "PRIVATE"],
    default: "PUBLIC",
  },
  coverImage: {
    type: String,
    default: null
  },
  totalSongs : {
    type : Number,
    default : 0,
  }
},{timestamps :true});
playlistSchema.index({owner : 1});

const playlistModel  = mongoose.model("playlist", playlistSchema);

module.exports = playlistModel;
