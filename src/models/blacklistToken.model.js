const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({  
    token: {
        type: String,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default expiration: 7 days from now
    }
});

blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistToken = mongoose.model("BlacklistToken", blacklistTokenSchema);
module.exports = blacklistToken;