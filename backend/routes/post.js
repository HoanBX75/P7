const express= require('express');
const router = express.Router();

/* Requiring these modules */
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const postCrtl = require('../controllers/post');


/* end point posts  */
router.post('/', auth, multer, postCrtl.createPost);
router.get("/", auth, postCrtl.getAllPost);
router.get("/:id", auth, postCrtl.getOnePost);

router.delete("/:id", auth ,postCrtl.deletePost);
router.put("/:id", auth , multer, postCrtl.updatePost);
router.post('/:id/like', auth, postCrtl.likePost);

module.exports = router;
