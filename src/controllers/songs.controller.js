const songModel = require("../models/songs.model");
const { uploadSongfile, uploadCoverfile } = require("../services/storage.service");

async function addSongController(req, res) {
    try {
        const user = req.user;

        if (user.role !== "Artist") {
            return res.status(403).json({ message: "Only artists can upload songs!" });
        }

        const data = req.body;

        if (!req.files || !req.files.song_url || !req.files.cover) {
            return res.status(400).json({ message: "Song file and cover image are required." });
        }

        const songBuffer = req.files.song_url[0].buffer;
        const coverBuffer = req.files.cover[0].buffer;

        const checkDuplicate = await songModel.findOne({
            title: (data.title).toLowerCase().trim()
        });

        if (checkDuplicate) {
            return res.status(400).json({ message: "Song with this title already exists!" });
        }

        const songResult = await uploadSongfile(songBuffer);
        const imageResult = await uploadCoverfile(coverBuffer);

        const song = await songModel.create({
            title: (data.title).toLowerCase().trim(),
            artist_id: user._id,
            duration: data.duration,
            song_url: songResult.url,
            cover: imageResult.url
        });

        return res.status(200).json({ message: "Song uploaded successfully!", song });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

async function getSongController(req, res) {
    try {
        console.log("here");
        const songs = await songModel.find().populate("artist_id", "username");
        console.log(songs)
        return res.status(200).json({ message: "Songs fetched successfully!", songs });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
}

async function searchController(req, res) {
    try {
        const q = req.query.q;
        if (!q) {
            return res.status(400).json({ message: "Search query is required." });
        }

        const suggestions = await songModel.find({
            title: { $regex: q, $options: "i" },
        })
            .limit(10)
            .select("title song_url artist_id cover duration")
            .populate("artist_id", "username");

        if (suggestions.length === 0) {
            return res.status(404).json({ message: "No results found." });
        }

        return res.status(200).json({ message: "Songs found!", suggestions });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { addSongController, getSongController, searchController };