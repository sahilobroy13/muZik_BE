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
            {title : data.title},
            {song_url : data.song_url}
        ]
    })

    if(checkDuplicate){
        res.status(400).json({message : "Song Already available!"});
    }
    const songResult = await uploadSongfile(songBuffer);
    const imageResult = await uploadCoverfile(coverBuffer);

    const song = await songModel.create({
        title : data.title,
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

module.exports = { addSongController };