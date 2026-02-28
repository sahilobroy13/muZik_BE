const {ImageKit} = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey : process.env.PRIVATE_KEY,
})

async function uploadSongfile(buffer){
    const result = await client.files.upload({
        file : buffer.toString("base64"),
        fileName :"music.mp3",
    })
    return result;
}
async function uploadCoverfile(buffer) {
    const result = await client.files.upload({
        file : buffer.toString("base64"),
        fileName : "image.png"
    })
    return result;
}

module.exports = {uploadSongfile ,uploadCoverfile };