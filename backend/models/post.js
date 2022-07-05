const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    usersLiked: { type: [String], required: true },
    postTime: { type: Number, required: true }
});

 module.exports= mongoose.model('Post', postSchema);
 