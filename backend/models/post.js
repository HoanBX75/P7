const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {type: String, required: true},
    userName: {type: String, required: true},
  
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    usersLiked: { type: [String], required: true },
    postDate: { type: Date, required: true }
});

 module.exports= mongoose.model('Post', postSchema);
 
