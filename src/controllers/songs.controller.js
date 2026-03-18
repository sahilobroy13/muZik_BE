const songModel = require("../models/songs.model");
const { uploadSongfile, uploadCoverfile  } = require("../services/storage.service");

async function addSongController(req, res) {
  try {
    const user = req.user;
    if (user.role != "Artist") {
      res.status(402).json({ message: "You don't have access!" });
    }
    const data = req.body;
    const songBuffer = req.files.song_url[0].buffer;
    const coverBuffer = req.files.cover[0].buffer;
    const checkDuplicate = await songModel.findOne({
        $or :[
            {title : (data.title).toLowerCase().trim()},
            {song_url : data.song_url}
        ]
    })

    if(checkDuplicate){
        res.status(400).json({message : "Song Already available!"});
    }
    const songResult = await uploadSongfile(songBuffer);
    const imageResult = await uploadCoverfile(coverBuffer);

    const song = await songModel.create({
        title : (data.title).toLowerCase().trim(),
        artist_id : user._id,
        duration : data.duration,
        song_url : songResult.url,
        cover : imageResult.url
    })
    
    res.status(200).json({message : "Song Uploaded successfully!", song});

    } catch (error) {
    res.status(500).json({error });
    console.log({message :"Something went wrong"},error.message);
   }
}

async function getSongController(req,res){
    try {
        const songs = await songModel.find();
        res.status(200).json({message : "Song Fetched Successfully!",songs});   
    } catch (error) {
        res.status(500).json({message : "Something went wrong!"},error.message);
    }
}

async function searchController(req,res){
    try {
        const q = req.query.q;
        if(!q){
            return res.status(200).json({message : "You have to give value to search"})
        }
        
        const suggestions = await songModel.find({
            title : {$regex : q, $options : 'i'},
        }).limit(5).select("title").select("song_url").select("artist_id").select("cover");
        if(suggestions.length === 0){
            return res.status(404).json({message : "No result found! "});
        }
        console.log(q);
        res.status(200).json({message : "Fetched Song!", suggestions})
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
}
module.exports = { addSongController, getSongController ,searchController};