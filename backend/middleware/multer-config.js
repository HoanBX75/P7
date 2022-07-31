const multer = require('multer');
const trace=require ('../utils/TraceLogB');

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
};

/*
Description : 
  This file is a middleware is used to define : 
     - the destination (where the images will be stored)
     -  the name of the file that will be created : 
          name_of_the_image{Date}.{extension}
   This middleware is used when creating, updating a sauce when an image is provided.

*/

const scriptMultername = 'middleware/multer-config.js : ';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        trace.Log_line();
        trace.Log_msg (1,scriptMultername , 'Callback destination');
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        trace.Log_line();
       
        trace.Log_obj(1,scriptMultername , 'Callback filename, file = ', file);

        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const new_filename = name + Date.now() + '.' + extension;

        trace.Log_obj(1,scriptMultername , 'Callback filename, new filename = ',  new_filename);
        callback(null, new_filename);
    }
});

module.exports = multer({storage}).single('image');
trace.Log_msg (1,scriptMultername , 'loaded '  );
