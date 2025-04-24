const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' } ,
  duration: { type: Number, required: true },
  coverImage: { type: String }, 
  favorite: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Track', trackSchema);
