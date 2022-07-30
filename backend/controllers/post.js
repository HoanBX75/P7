const Post = require('../models/post');
const fs = require('fs');

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
    const funcName =  scriptname + '/createPost() : '; 
    console.log("========================================================================>")
    console.log (funcName + 'begin '  );
    console.log (funcName  + " req.body = ", req.body);
    console.log (funcName  + " req.file.filename = ", req.file.filename);
   // Get pOST  fields from the request body
    // -------------------------------------
    let i_post = req.body;
    delete i_post._id;
    let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    let i_date =   Date.now();
    console.log (funcName  + " i_post  = ", i_post);
    console.log (funcName  + " i_date  = ", i_date);
    console.log (funcName  + " url0 = ", url0);

    // Build Model POST  object :
    // -------------------------

    const db_post = new Post ({
            ...i_post,
            imageUrl: url0,
            usersLiked: [],
            postDate: i_date
    })

    console.log (funcName  + " Create DB post =  ", db_post);

    // Create POST object in mongodb
    // ------------------------------
    db_post.save()
    .then(() => { 
            console.log (funcName  + "End: Post added sucessfully  ");
            console.log ('--------------------------------------> ');
            res.status(201).json({message: "Post  added !"})
            })
    .catch((error) => {
            console.log (funcName  + " End:  Error,  Post not added : " + error );
            console.log ('--------------------------------------> ');
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
    console.log("========================================================================>");
    console.log (funcName + 'begin '  );

    // https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573/12
    // https://stackoverflow.com/questions/67264632/mongoose-sorting-by-createdat
    // https://www.statology.org/mongodb-sort-by-date/

    
    // Get Posts object from  mongodb
    // --------------------------------

        Post.find().sort({"postDate": -1}) 
        .then(posts => {
          //   console.log (funcName + ' - getAll  posts= ', posts );
          console.log (funcName + ' - getAllPosts OK  ' );
            res.status(200).json(posts);
        }
        )
        .catch(error => {
            console.log (funcName + ' - getAllPosts  error= ', error );
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
        console.log("========================================================================>");
        console.log (funcName + 'BEGIN '  );

        // Get POST object from  mongodb
        // --------------------------------

        Post.findOne({_id: req.params.id})
        .then(post => { 
            console.log (funcName + ' - getOnePost  post = '  , post );
            res.status(200).json(post)})
        .catch(error => {
            console.log (funcName + ' - getOnePost  error  = '  , error );
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
    const funcName =  scriptname + '/deletePost() : '; 
    console.log("========================================================================>");
    console.log (funcName + " post  id (params id ) = ", req.params.id);

    //  Get the post from mongodb  by the id 
   // --------------------------------------

    Post.findOne({_id: req.params.id})
    .then(post => {
        console.log (funcName + " Found post  id = ", req.params.id);

        console.log (funcName +  ' post userid  = ' +  post.userId);
        console.log (funcName +    'req userid  = ' +  req.userId);

        const filename = post.imageUrl.split('/images/')[1];
        console.log (funcName + " Image Filename to remove  = ", filename);

        // Check that the requestor is the owner of the Post 
        // -------------------------------------------------

        if ( post.userId !== req.userId) {
            console.log (funcName +    'unauthorized request  ' );
            res.status(401).json(  { message: 'unauthorized request' } );
        }
        else 
        {
            try {
                console.log (funcName +    'Unlinking the file   ' );
                const filename = post.imageUrl.split('/images/')[1];
                console.log (funcName + " Image Filename to remove  = ", filename);

                // Unlink the image  (delete the image )
                // --------------------------------------
                fs.unlink(`images/${filename}`, (err) => {

                    if (err) {
                        console.log (funcName + "  ERROR  deleted file  = ", filename);
                        console.log (funcName + "  ERROR  deleted file err  = ", err);
                         throw err; 
                     }

                     console.log (funcName + " Deleted filename   = ", filename);

                     // Delete the object Post  in Mongodb  
                    // -----------------------------------
                    Post.deleteOne({_id: req.params.id})
                    .then(() => {
                       console.log (funcName + " OK Deleted post  id  = ", req.params.id);
                      res.status(200).json({message: 'Post supprimé.'})
                    })
                    .catch(error => {
                        console.log (funcName + " Error mongodb update fails   = ", error);
                         res.status(400).json({error})
                    });

                });
            }
            catch (error){
                // Error occured in the unlink ;
                console.log (funcName +    'Error while deleting image and  updating   error =  ', error  );
                res.status(500).json( error );
            }
        }
     })
    .catch(error => {
        console.log (funcName + " Error Not Deleted file   = ", error);
        res.status(400).json({error})
    });


} // end of delete 

// ======================
// 6. UPDATE POST 
// ======================
/*
PUT /api/post/:id 
EITHER
Post  as JSON
OR { post: String,
image: File }
The response :  { message: String }

controllers/post.js/updatePost() :  postObject     =  {
  userName: 'titi',
  text: 'zzzz',
  title: 'zzzzz',
  userId: '62cc84c93b888b5ec569245a',
  image: 'undefined'
}

En base :
    _id    :62cdeb974b8d11f7c369d07a
    userId    :"62cdb253b4135cd12ad451dc"
    userName    :"hoan"
    title    :"jkdljf"
    text    :"ff"
    imageUrl    :"http://localhost:3000/images/annie-spratt-Eg1qcIitAuA-unsplash.jpg1657..."
    usersLiked    :    Array
    postDate    :2022-07-12T21:45:59.085+00:00
    __v
    :0

*/

exports.updatePost = (req, res, next) => {
  
    // Search for a sauce with the id 
    const scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/updatePost() : '; 
    console.log ('--------------------------------------> ');
    console.log (funcName + " post  id (params id ) = ", req.params.id);
  


    console.log("============");
   //  console.log (funcName + " req  = ", req );
    console.log (funcName + " req file  = ", req.file );
    console.log (funcName + " req image  = ", req.image );
    console.log (funcName + " req body  = ", req.body );
 //   res.status(200).json({ message: 'Sauce modifiée avec succès !' });
  
   if (req.file ) {
       // The image is to udpate  :  Post  as JSON
    console.log (funcName + " Image to update   ");
    Post.findOne({_id: req.params.id})
    .then(post  => {

        console.log (funcName + " Found in MongoDB post  id = ", req.params.id);
        let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const filename = post.imageUrl.split('/images/')[1];
        console.log (funcName + " deleting this file  = ", filename);

        
        fs.unlink(`images/${filename}`, () => {
            console.log (funcName + " Ok deleted file  = ", filename);
            
      

            let opost =  req.body;
            let i_date =   Date.now();

            console.log (funcName + " req opost  = ", opost);
            console.log (funcName + "  imageUrl  = ", url0);
            const postObject = {
                  ...opost,
                imageUrl: url0,
                postDate: i_date 
            };


            console.log (funcName + " input post   = ", postObject);

            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() =>{ 
                console.log (funcName + " OK post  updated -  id   = ", req.params.id);
                console.log("============");
                res.status(200).json({ message: 'Post  updated with success !' });
            })
            .catch(error =>{
                console.log (funcName + " ERROR  post  updated -  id   = ", error );
 

                res.status(400).json({ error })
            })
            
        })    ;
        // .catch(error => res.status(500).json({ error })); 

    })
    .catch(error => {
        console.log (funcName + " Error Post  update - error    = ", error);
        res.status(400).json({error})
    } );    
   }
   else {
   // The image is not updated :  Sauce as JSON
   // ============================================

    console.log (funcName + " No  image to update   ");
   
   //  delete postObject.image;
   // delete postObject._id;
   
    let i_date =   Date.now();
   const postObject = { ...req.body,  postDate: i_date } ;

 //   const postObject = { ...req.body } ;
   console.log (funcName + " postObject     = ", postObject);


    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => {
         console.log (funcName + " OK Post  updated -  id   = ", req.params.id);
         console.log("============");
         res.status(200).json({ message: 'Post updated with success !' })
        })
        .catch(error => res.status(400).json({ error }));

   }



}



// 5. LIKE  DISLIKE SAUCE     
// /api/post/like/:id
// { userId: String, like: Number }
// { message: String }

    exports.likePost = (req, res, next) => {

        const funcName =  scriptname + ' - likePost() : ';
    
        const userid  = req.body.userid;
        const dotheLike = req.body.dotheLike;
        const post_id =  req.params.id;

        console.log("============");
        console.log (funcName + " req   ", req.body);
        console.log (funcName + " post  id   ", post_id);
        console.log (funcName + " userid   ", userid);
        console.log (funcName + " dotheLike   ", dotheLike);

       


         // Search for a Post  with the id 
        Post.findOne({_id: post_id})
        .then((post) => {
            console.log (funcName + " post  found   ", post );
             // Get the  user likes 
             let usersLiked =  post.usersLiked;
            let new_usersLiked = [];

         
            switch (dotheLike) {
                case 0:  /* unlike case */ 
                    // the user cancels his choice 
                    // so we need to remove the user from the like list or dislike list 
                    // https://developer.mozilla.org/fr/docs/Learn/JavaScript/First_steps/Arrays

                    let l_liked = usersLiked.length;
                    new_usersLiked = usersLiked.filter (function(value, index, arr){ 
                        return userid != value ; });
   
                    break;
                case 1 :    /* like case */
                    usersLiked.push (userid);
                    new_usersLiked = usersLiked;
                    break;
        
            }

            console.log (funcName + " new usersLiked   ", new_usersLiked);
            console.log (funcName + " new usersLiked  length  ", new_usersLiked.length);

            // Update the Post  
            const newPost_usersLiked  = {
                usersLiked: new_usersLiked
            }

            Post.updateOne({ _id: req.params.id }, {...newPost_usersLiked, _id: req.params.id})
            .then(()=> {
                console.log (funcName + " Post usersLiked updated    ");
                 res.status(201).json({message: 'usersLike  updated .'})
            })
            .catch(error => {
                console.log (funcName + " Post usersLiked Not updated  - Error =    ", error) ;
                res.status(400).json({error})
            });

        })
        .catch(error => { 
            console.log (funcName + " Cannot find Post - Error   = ", error) ;
            res.status(400).json({error})
        });
       

  

}

console.log (scriptname + 'loaded');
