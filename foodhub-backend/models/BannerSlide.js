const mongoose = require('mongoose');

const BannerSlideSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('BannerSlide', BannerSlideSchema);