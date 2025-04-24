const mongoose = require('mongoose');
const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    releaseYear: { type: Number, required: true },
    genre: { type: String, required: true }
});
module.exports = mongoose.model('Album', albumSchema);