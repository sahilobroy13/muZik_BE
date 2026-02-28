// const songModel = require("../models/songs.model");
const express = require("express");
const { authenticateUser } = require("../middleware/auth.middleware");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const songController = require("../controllers/songs.controller");

router.post("/artist/create-music",authenticateUser,
  upload.fields([
    { name: "song_url", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  songController.addSongController,
);
router.get("/",authenticateUser, songController.getSongController);

router.get('/search' ,authenticateUser, songController.searchController);

module.exports = router;