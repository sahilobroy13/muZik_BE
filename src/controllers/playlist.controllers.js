const playlistModel = require("../models/playlist.model");
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
        }
        return res.status(401).json({message : "You are not the owner!"});

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = { createPlaylistController , getPlaylistController , deletePlaylistController };