const Post = require('../models/post');
const User = require('../models/User');

const fs = require('fs');
const adminUserList  = require ('../data/adminUserList.js');
const trace=require ('../utils/TraceLogB');

scriptname = 'controllers/post.js: ';

/*
  This file is a set of middlewares handling Post requests.
*/

/*  
-----------------------------------------------------------------------  
1. CREATE POST   : createPost()
---------------------------------------------------------------------------
API : POST  /api/post/add
-----------------------------------------------------------------------
Description : 
This function creates  a Post  in mongodb.
It does the following : 
    - extract the post  attributes from the request body
    - build the other Post  attributes
    - Create the Post  in the mongodb 

Inputs : 
Input  Post  information is stored in  the body 

req.body =  [Object: null prototype] {
  userName: 'toto',
  text: 'DFDF',
  userId: '62dfffa934044eca56025ed0'
}
and the req.file.name 
 req.file.filename =  aw-creative-VGs8z60yT2c-unsplash.jpg1659191025684.jpg

In response, it returns a message  as  { message: String }
*/



exports.createPost = (req, res, next) => {
    scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/createPost()'; 
    trace.Log_line();
    trace.Log_msg (1,funcName , 'BEGIN '  );
    trace.Log_obj(1,funcName  , " req.body = ", req.body);
    trace.Log_obj(1,funcName  , " req.file.filename = ", req.file.filename);
   // Get pOST  fields from the request body
    // -------------------------------------
    let i_post = req.body;
    delete i_post._id;
    let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    let i_date =   Date.now();
    trace.Log_obj(1,funcName  , " i_post  = ", i_post);
    trace.Log_obj(1,funcName  , " i_date  = ", i_date);
    trace.Log_obj(1,funcName  , " url0 = ", url0);

    // Build Model POST  object :
    // -------------------------

    const db_post = new Post ({
            ...i_post,
            imageUrl: url0,
            usersLiked: [],
            postDate: i_date
    })

    trace.Log_obj(1,funcName  , " Create DB post =  ", db_post);

    // Create POST object in mongodb
    // ------------------------------
    db_post.save()
    .then(() => { 
            trace.Log_msg (1,funcName  , "End: Post added sucessfully  ");
            trace.Log_line();
            res.status(201).json({message: "Post  added !"})
            })
    .catch((error) => {
            trace.Log_obj(1,funcName  , " End:  Error,  Post not added : " + error );
            trace.Log_line();
            res.status(400).json({error} ) 
    })
}
        
/*  
-----------------------------------------------------------------------  
3. GET ALL  POSTS  : getAllPost()
-----------------------------------------------------------------------
API : GET  /api/post/

-----------------------------------------------------------------------
Description : 
This function gets  all POSTS  from mongodb.
In the response, it returns a Json table containing all the posts (a 
    post  is following the model object post  for mongodb mongodb). 
Returns Array of Post  
*/

exports.getAllPost = (req, res, next) => {
    scriptname = 'controllers/post.js';
   
    const funcName =  scriptname + ' - getAllPost() : ';
    trace.Log_line();
    trace.Log_msg (1,funcName , 'BEGIN '  );

    // https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573/12
    // https://stackoverflow.com/questions/67264632/mongoose-sorting-by-createdat
    // https://www.statology.org/mongodb-sort-by-date/

    
    // Get Posts object from  mongodb
    // --------------------------------

        Post.find().sort({"postDate": -1}) 
        .then(posts => {
          //    (funcName + ' - getAll  posts= ', posts );
          trace.Log_msg (1,funcName ,' - getAllPosts OK  ' );
            res.status(200).json(posts);
        }
        )
        .catch(error => {
            trace.Log_obj(1, funcName  , ' - getAllPosts  error= ', error );
            res.status(400).json({error})
        });
        
}

/*  
-----------------------------------------------------------------------  
3. GET ONE  POST  : getOnePost()
-----------------------------------------------------------------------
API : GET /api/POST/:id 
id : identifier of a POST  
-----------------------------------------------------------------------
Description : 
This function gets  a POST  information from mongodb.
In the response, it returns a Json string form the returned 
model object POST obtained from mongodb. 

Returns a Single Post 
*/

exports.getOnePost = (req, res, next) => {

        scriptname = 'controllers/post.js';
        const funcName =  scriptname + ' - getOnePost() : ';
        trace.Log_line();
        trace.Log_msg (1,funcName , 'BEGIN '  );

        // Get POST object from  mongodb
        // --------------------------------

        Post.findOne({_id: req.params.id})
        .then(post => { 
            trace.Log_obj(1,funcName , ' - getOnePost  post = '  , post );
            res.status(200).json(post)})
        .catch(error => {
            trace.Log_obj(1,funcName , ' - getOnePost  error  = '  , error );
            res.status(400).json({error})
        });
    }

/*  
-----------------------------------------------------------------------  
4. DELETE  POST  : deletePost()
-----------------------------------------------------------------------
API : DELETE  /api/post/:id 
id : identifier of a post 
-----------------------------------------------------------------------
Description : 
This function deletes  a post.
   Get the Post  from mongodb
   It checks first if the requestor user is the owner of the post.
   If a image file is provided : 
        - deletes the previous file image 
        - delete the post in  mongodb 
    If an image is not provided : 
        - delete the post in  mongodb 

The response :  { message: String }

*/


exports.deletePost = async  (req, res, next) =>{
    const scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/deletePost()'; 
    trace.Log_line();
    trace.Log_obj(1,funcName , " post  id (params id ) = ", req.params.id);

    //  Get the post from mongodb  by the id 
   // --------------------------------------

    Post.findOne({_id: req.params.id})
    .then(post => {

        trace.Log_obj(1,funcName , " Found post  id = ", req.params.id);

        trace.Log_obj(1,funcName , ' post userid  = ' +  post.userId);
        trace.Log_obj(1,funcName ,    'req userid  = ' +  req.userId);
        trace.Log_obj(1,funcName ,    'req username  = ' +  req.username);

        const filename = post.imageUrl.split('/images/')[1];
        trace.Log_obj(1,funcName , " Image Filename to remove  = ", filename);

        // Check that the requestor is the owner of the Post  or an admin user
        // -------------------------------------------------------------------
        if (( post.userId !== req.userId)  && (!isUserAdmin(req.usertype)))  {
            trace.Log_msg (1,funcName ,   'unauthorized request  ' );
            res.status(401).json(  { message: 'unauthorized request' } );
        }
        else 
        {
            try {
                trace.Log_msg (1,funcName ,    'Unlinking the file   ' );
                const filename = post.imageUrl.split('/images/')[1];
                trace.Log_obj(1,funcName , " Image Filename to remove  = ", filename);

                // Unlink the image  (delete the image )
                // --------------------------------------
                fs.unlink(`images/${filename}`, (err) => {

                    if (err) {
                        trace.Log_obj(1,funcName , "  ERROR  deleted file  = ", filename);
                        trace.Log_obj(1,funcName , "  ERROR  deleted file err  = ", err);
                         throw err; 
                     }

                     trace.Log_obj(1,funcName , " Deleted filename   = ", filename);

                     // Delete the object Post  in Mongodb  
                    // -----------------------------------
                    Post.deleteOne({_id: req.params.id})
                    .then(() => {
                       trace.Log_obj(1,funcName , " OK Deleted post  id  = ", req.params.id);
                      res.status(200).json({message: 'Post supprimé.'})
                    })
                    .catch(error => {
                        trace.Log_obj(1,funcName , " Error mongodb update fails   = ", error);
                         res.status(400).json({error})
                    });

                });
            }
            catch (error){
                // Error occured in the unlink ;
                trace.Log_obj(1,funcName ,    
                    'Error while deleting image and  updating   error =  ', error  );
                res.status(500).json( error );
            }

        }

     })
    .catch(error => {
        trace.Log_obj(1,funcName ," Error Not Deleted file   = ", error);
        res.status(400).json({error})
    });
} // end of delete 



/*  
-----------------------------------------------------------------------  
5. UPDATE Post  : updatePost()
-----------------------------------------------------------------------
API : PUT /api/post/:id 
id : identifier of a post 
-----------------------------------------------------------------------
Description : 
This function updates  a Post.
   Get the Post from mongodb
   It checks first if the requestor user is the owner of the post.
   If a image file is provided : 
        - deletes the previous file image 
        - updates the post in monogodb mongodb 
    If an image is not provided : 
        - updates the post in monogodb mongodb 

Inputs : 
    1/ without file (the Post information is in the body as a Json object   )
  

    req body  =  [Object: null prototype] {
        userName: 'titi',
        text: 'merci',
        userId: '62e000b034044eca56025ee3',
        image: 'undefined'
    }

    2/ with a file :  (the post  information is in the body , and file information 
        is stored in req.file     )

    req body  =  [Object: null prototype] {
        userName: 'titi',
        text: 'merci',
        userId: '62e000b034044eca56025ee3',
        image: 'undefined'
    }
 req file  =  {
  fieldname: 'image',
  originalname: 'fred-kleber-gTbaxaVLvsg-unsplash.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'images',
  filename: 'fred-kleber-gTbaxaVLvsg-unsplash.jpg1659197220743.jpg',
  path: 'images\\fred-kleber-gTbaxaVLvsg-unsplash.jpg1659197220743.jpg',
  size: 79032
}

The response :  { message: String }

*/


exports.updatePost = (req, res, next) => {
  

    const scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/updatePost()'; 
    trace.Log_line();
  
    trace.Log_obj(1,funcName , " post  id (params id ) = ", req.params.id);
  
    trace.Log_obj(1,funcName , " req file  = ", req.file );
    trace.Log_obj(1,funcName , " req image  = ", req.image );
    trace.Log_obj(1,funcName , " req body  = ", req.body );

  
   //  Get the Post  from mongodb  
   // ============================
   Post.findOne({_id: req.params.id})
    .then(post => {

        // Post  is found  
        trace.Log_obj(1,funcName , " Found in MongoDB Post id = ", req.params.id);
       // Check that the requestor is the owner of the Post  Or is Admin 
        // =============================================================

        trace.Log_obj(1,funcName ,  ' Post  userid  = ' , post.userId);
        trace.Log_obj(1,funcName ,   'req userid  = ' ,  req.userId);
        trace.Log_obj(1,funcName ,    'req username ' ,  req.username);
        trace.Log_obj(1,funcName ,    'req usertype ' ,  req.usertype);

      //   if (( post.userId !== req.userId)  && (!isUserAdmin(req.username)))  {
        if (( post.userId !== req.userId)  && (!isUserAdmin(req.usertype)))  {
            res.status(401).json(  { message: 'unauthorized request' } );
        }
        else 
        {
            if (req.file ) {
               // ============================================                        
                 // The image is to udpate  :  Post  as JSON
                // ============================================  
                trace.Log_msg (1,funcName , " Image to update   ");
                trace.Log_obj(1,funcName , " Found in MongoDB post  id = ", req.params.id);
                let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        
                const filename = post.imageUrl.split('/images/')[1];
                trace.Log_obj(1,funcName , " deleting this file  = ", filename);

                  try {
                   
                        // Unlink the image  (delete the image )
                         // --------------------------------------
                        fs.unlink(`images/${filename}`, () => {
                            trace.Log_obj(1,funcName , " Ok deleted file  = ", filename);
                            
                            let opost =  req.body;
                            let i_date =   Date.now();

                            trace.Log_obj(1,funcName , " req opost  = ", opost);
                            trace.Log_obj(1,funcName , "  imageUrl  = ", url0);
                            const postObject = {
                                text: opost.text,
                                imageUrl: url0,
                                postDate: i_date 
                            };

                            trace.Log_obj(1,funcName , " input post   = ", postObject);

                            // Update the post in mongoDB
                             // --------------------------
 
                            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                            .then(() =>{ 
                                trace.Log_obj(1,funcName ," OK post  updated -  id   = ", req.params.id);
                              
                                res.status(200).json({ message: 'Post  updated with success !' });
                            })
                            .catch(error =>{
                                trace.Log_obj(1,funcName ," ERROR  when updating in mongodb -  error   = ", error );
                                res.status(400).json({ error })
                            })
                        })   ;
                  
                  } 
                  catch (err ) {
                    // Error occured in the unlink ;
                    trace.Log_obj(1,funcName , " Error  when unlinking  the file - Error =  ",err);
                    res.status(500).json( err );
                }  
            }
            else {
                // The image is not updated :  Post as JSON
                // =========================================
             
                trace.Log_msg (1, funcName , " No  image to update   ");
                
                 let i_date =   Date.now();
                const postObject = { text: req.body.text,  postDate: i_date } ;
             
               //   const postObject = { ...req.body } ;
               trace.Log_obj(1,funcName  ," postObject     = ", postObject);
             
                // Update the Post in mongodb
                // --------------------------
                 Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                     .then(() => {
                        trace.Log_obj(1,funcName , " OK Post  updated -  id   = ", req.params.id);
                      res.status(200).json({ message: 'Post updated with success !' })
                     })
                     .catch(error => {
                        trace.Log_obj(1,funcName,  " Error  when updating Post in mongodb - Error =  ",error);
                        res.status(400).json({ error })
                    });
            }
        }
    })
    .catch(error => {
        trace.Log_obj(1, funcName , " Error Post not found    = ", error);
        res.status(400).json({error});
    } ); 

} // end of update  


/*  
-----------------------------------------------------------------------  
5. LIKE UNLIKE POST  :  likePost()
-----------------------------------------------------------------------
API  POST  /api/post/like/:id
Req body { userid: String, dotheLike: action type }
Rsp { message: String }
id : post Id 
-----------------------------------------------------------------------
Description : 
This function gives a Like status to a  Post 
if dotheLike = 0 then it cancels the like 
If dotheLike =1  then the user likes  so it is added to a like list .


The treatment  is the following : 
    - Find the post 
    - According to the dotheLike 
        add or remove the issuer user of the like 
    - Update the Post in mongoDB    

Inputs : 
In the body (req.body.userId , req.body.dotheLike)
  { userId: String, like: Number }
Returns : 
In response, it returns a message  as  { message: String }
*/


exports.likePost = (req, res, next) => {

        const funcName =  scriptname + ' - likePost()';
    
        const userid  = req.body.userid;
        const dotheLike = req.body.dotheLike;
        const post_id =  req.params.id;

        trace.Log_line();
        trace.Log_obj(1,funcName , " req   ", req.body);
        trace.Log_obj(1,funcName , " post  id   ", post_id);
        trace.Log_obj(1,funcName, " userid   ", userid);
        trace.Log_obj(1,funcName, " dotheLike   ", dotheLike);


   //  Get the Post  from mongodb  
   // ============================

        Post.findOne({_id: post_id})
        .then((post) => {
            trace.Log_obj(1,funcName , " post  found   ", post );

             // Get the  user likes table 
             // --------------------------
             let usersLiked =  post.usersLiked;
            let new_usersLiked = [];

            switch (dotheLike) {
                 /* unlike case */ 
                case 0: 
                    // the user cancels his choice 
                    // so we need to remove the user from the like list 
                    // ---------------------------------------------------
                    trace.Log_msg (1,funcName + " The user UnLikes  ");
                    let l_liked = usersLiked.length;
                    new_usersLiked = usersLiked.filter (function(value, index, arr){ 
                        return userid != value ; });
   
                    break;
                /* like case */
                case 1 :   
                    // Add the user to the like List 
                    // -----------------------------
                    trace.Log_msg (1,funcName + " The user Likes  ");
                    usersLiked.push (userid);
                    new_usersLiked = usersLiked;
                    break;
        
            }

            trace.Log_obj(1,funcName , " new usersLiked   ", new_usersLiked);
            trace.Log_obj(1,funcName , " new usersLiked  length  ", new_usersLiked.length);

            // In Mongodb Update the Post  with the new list of likes 
            //  ------------------------------------------------------
            const newPost_usersLiked  = {
                usersLiked: new_usersLiked
            }

            Post.updateOne({ _id: req.params.id }, {...newPost_usersLiked, _id: req.params.id})
            .then(()=> {
                trace.Log_msg (1,funcName + " Post usersLiked updated    ");
                 res.status(201).json({message: 'usersLike  updated .'})
            })
            .catch(error => {
                trace.Log_obj(1,funcName , " Post usersLiked Not updated  - Error =    ", error) ;
                res.status(400).json({error})
            });

        })
        .catch(error => { 
            trace.Log_obj(1,funcName , " Cannot find Post - Error   = ", error) ;
            res.status(400).json({error})
        });
}


/*
 Function isUserAdmin 
 This function returns true if the username is an admin
*/

function isUserAdmin (usertype)
{
    const scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/isUserAdmin()'; 
    if ( usertype == null ) return false ;
    if ( usertype == 'admin' )  return (true);
    return (false);
/*
    let found   = adminUserList.find (name => name === username);
    trace.Log_obj(1,funcName  , "username =  ", username);
    trace.Log_obj(1,funcName  , "  admin flag =  ", found);
    if (found)  return (true);

    return (false);
    */ 
}



trace.Log_msg (1,scriptname , 'loaded');
