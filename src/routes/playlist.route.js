const express = require("express");
const { authenticateUser } = require("../middleware/auth.middleware");
const playlistController = require("../controllers/playlist.controllers");
const router = express.Router();
const multer = require("multer")
const upload = multer({storage : multer.memoryStorage() });

router.post("/", authenticateUser,
    upload.fields([{name : "coverImage" , maxCount :1}])
    ,playlistController.createPlaylistController);
router.get("/", authenticateUser, playlistController.getPlaylistController);
router.get("/:id", authenticateUser, playlistController.getSinglePlaylistController)

router.delete("/:id", authenticateUser , playlistController.deletePlaylistController);
router.post("/:id/songs", authenticateUser, playlistController.addSongController);
module.exports = router;