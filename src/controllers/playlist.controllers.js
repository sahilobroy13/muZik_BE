const playlistModel = require("../models/playlist.model");
const playlistSongModel = require("../models/playlistSongs.model");
const { uploadCoverfile } = require("../services/storage.service");

async function createPlaylistController (req,res){
    try {
        const data = req.body;
        if(!data){
            return res.status(203).json({message : "Playlist Data REquired !"})
        }
        const user = req.user;
        const coverBuffer = req.files.coverImage[0].buffer;
        const coverImageResult = await uploadCoverfile(coverBuffer);
        console.log(coverImageResult.url, coverImageResult)
        const playlist = await playlistModel.create({
            name: data.name,
            description : data.description,
            owner : user._id,
            visibility : data.visibility,
            coverImage : coverImageResult.url,
        })
        return res.status(200).json({message : "Playlist Created !", playlist});
        
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function getPlaylistController(req,res ) {
    try {
        const user = req.user;
        const playlists = await playlistModel.find({owner : user._id});
        res.status(202).json({message : "Playlist fetched Successfully!", playlists});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function deletePlaylistController(req,res){
    try {
        const playlistId = req.params.id;
        if(!playlistId){
            return res.status(401).json({message :"Playlist id is missing!"});
        }
        const user = req.user;
        const playlist = await playlistModel.findOne( {_id : playlistId});

        if(playlist.owner.equals(user._id)){
            await playlistModel.deleteOne({ _id : playlistId});
            res.status(202).json({message : "Playlist deleted Successfully!"});            
        }else{  
            return res.status(401).json({message : "You are not the owner!"});
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function addSongController(req,res){
    try {
        const playlistId = req.params.id;
        if(!playlistId){
            return res.status(401).json({message :"Playlist id is missing!"});
        }
        const user = req.user;
        const playlist = await playlistModel.findOne( {_id : playlistId});
        if(!playlist){
            return res.status(403).json({message : "Playlist not Found!"});
        }

        if(!playlist.owner.equals(user._id)){
            return res.status(401).json({message : "Unauthorized Access!"});            
        }
        const {songId} = req.body;
        if(!songId){
            return res.status(400).json({message : "SongId is missinng!"});
        }
        const exists = await playlistSongModel.findOne({ playlistId, songId });
        if (exists) return res.status(400).json({message : "Song already in the playlist!"});
        const playlistSong = await playlistSongModel.create({
            playlistId,
            songId 
        })
       await playlistModel.findByIdAndUpdate(
        playlistId,
        { $inc: { totalSongs: 1 } }
        );

        res.status(200).json({message : "Song added to playlist!", playlistSong});
        
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

async function getSinglePlaylistController(req, res) {
  try {
    const playlistId = req.params.id;

    
    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    
    const playlistSongs = await playlistSongModel
      .find({ playlistId })
      .populate({
        path: "songId",
        select: "title cover artist_id", // only needed fields
        populate: {
          path: "artist_id",
          select: "username"
        }
      });

    
    const songs = playlistSongs.map(item => ({
      _id: item.songId._id,
      title: item.songId.title,
      cover: item.songId.cover,
      artist_id: item.songId.artist_id
    }));

    
    return res.status(200).json({
      name: playlist.name,
      coverImage: playlist.coverImage,
      totalSongs: playlist.totalSongs,
      songs
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { createPlaylistController , getPlaylistController , deletePlaylistController ,addSongController ,getSinglePlaylistController };