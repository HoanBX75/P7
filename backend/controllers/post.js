const Post = require('../models/post');
const fs = require('fs');

scriptname = 'controllers/post.js: ';
console.log (scriptname + 'begin'  );

// ========================================
// 1.  CREATE POST 
// ========================================
/*
DB post : 
 {
_id: "62cda538f4a278fac373ba14"
imageUrl: "http://localhost:3000/images/febrian-zakaria-sjvU0THccQA-unsplash.jpg1657644344094.jpg"
postDate: "2022-07-12T16:45:44.098Z"
text: "fg"
title: "rdetg"
userId: "62cc84c93b888b5ec569245a"
userName: "titi"
usersLiked: Array []
  }
*/

exports.createPost = (req, res, next) => {
    scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/createPost() : '; 
    console.log ('--------------------------------------> ');
    console.log (funcName  + "begin :  req.body = ", req.body);

    let i_post = req.body;
    delete i_post._id;
    let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    let i_date =   Date.now();
    console.log (funcName  + " i_post  = ", i_post);
    console.log (funcName  + " i_date  = ", i_date);
    console.log (funcName  + " url0 = ", url0);

    // let i_date =  new Date().toJSON();
    // const backToDate = new Date(i_date);
    //   https://www.w3schools.com/js/js_dates.asp

    const db_post = new Post ({
            ...i_post,
            imageUrl: url0,
            usersLiked: [],
            postDate: i_date
    })

    console.log (funcName  + " Create DB post =  ", db_post);

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
        
// ========================================    
// 2. GET ALL POSTS
// ========================================


exports.getAllPost = (req, res, next) => {
    console.log (scriptname + 'getAllPost '  );
    // https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573/12
    // https://stackoverflow.com/questions/67264632/mongoose-sorting-by-createdat
    // https://www.statology.org/mongodb-sort-by-date/

    
        Post.find().sort({"postDate": -1}) 
        .then(posts => {
          //   console.log (scriptname + ' - getAll  posts= ', posts );
            res.status(200).json(posts);
        }
        )
        .catch(error => {
            console.log (scriptname + ' - getAll  error= ', error );
            res.status(400).json({error})
        });
        
}


// 3. GET ONE POST 
exports.getOnePost = (req, res, next) => {
    console.log (scriptname + ' - getOnePost '  );
  //   console.log (scriptname + 'getOnePost req = ', req  );
    
        Post.findOne({_id: req.params.id})
        .then(post => { 
            console.log (scriptname + ' - getOnePost  post = '  , post );
            res.status(200).json(post)})
        .catch(error => {
            console.log (scriptname + ' - getOnePost  error  = '  , error );
            res.status(400).json({error})
        });


    
    }

// ========================================
// 4. DELETE  ONE POST 
// ========================================
exports.deletePost = async  (req, res, next) =>{
    const scriptname = 'controllers/post.js';
    const funcName =  scriptname + '/deletePost() : '; 
    console.log ('--------------------------------------> ');
    console.log (funcName + " post  id (params id ) = ", req.params.id);

    // Search for a post  with the id 


    Post.findOne({_id: req.params.id})
    .then(post => {
        console.log (funcName + " Found post  id = ", req.params.id);
        const filename = post.imageUrl.split('/images/')[1];
        console.log (funcName + " Image Filename to remove  = ", filename);

        
        fs.unlink(`images/${filename}`, () => {
            // Image Post  is deleted 
            console.log (funcName + " Deleted filename   = ", filename);
            // Delete the object Post in Mongodb  
            Post.deleteOne({_id: req.params.id})
            .then(() => {
                console.log (funcName + " Deleted Post  id  = ", req.params.id);
                res.status(200).json({message: 'Post deleted .'})

            })
        .catch(error => res.status(400).json({error}));
        });
        
        
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

console.log (scriptname + 'end');
