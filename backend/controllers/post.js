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
            console.log (scriptname + 'getAllSauce  posts= ', posts );
            res.status(200).json(posts);
        }
        )
        .catch(error => res.status(400).json({error}));
        
}


// 3. GET ONE POST 
exports.getOnePost = (req, res, next) => {
    console.log (scriptname + 'getOnePost '  );
  //   console.log (scriptname + 'getOnePost req = ', req  );
    
        Post.findOne({_id: req.params.id})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({error}));


    
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


// 6. UPDATE POST 
/*
PUT /api/sauces/:id 
EITHER
Sauce as JSON
OR { sauce: String,
image: File }
The response :  { message: String }

*/

exports.updatePost = (req, res, next) => {
    const funcName =  scriptname + ' - updatePost : ';
    // Search for a sauce with the id 

/*

    console.log("============");
   //  console.log (funcName + " req  = ", req );
    console.log (funcName + " req file  = ", req.file );
    console.log (funcName + " req image  = ", req.image );
    console.log (funcName + " req body  = ", req.body );

   if (req.file ) {
       // The image is to udpate  :  Sauce as JSON
    console.log (funcName + " Image to update   ");
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {

        console.log (funcName + " Found in MongoDB sauce id = ", req.params.id);
        let url0 = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const filename = sauce.imageUrl.split('/images/')[1];
        console.log (funcName + " deleting this file  = ", filename);

        
        fs.unlink(`images/${filename}`, () => {
            console.log (funcName + " Ok deleted file  = ", filename);
            let osauce =  JSON.parse(req.body.sauce);
            console.log (funcName + " req osauce  = ", osauce);
            console.log (funcName + "  imageUrl  = ", url0);
            const sauceObject = {
                  ...osauce,
                imageUrl: url0,
            };

            console.log (funcName + " input sauce  = ", sauceObject);

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() =>{ 
                console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
                console.log("============");
                res.status(200).json({ message: 'Sauce modifiée avec succès !' });
            })
            .catch(error => res.status(400).json({ error }))
        })    ;
        // .catch(error => res.status(500).json({ error })); 

    })
    .catch(error => {
        console.log (funcName + " Error Sauce update - error    = ", error);
        res.status(400).json({error})
    } );    
   }
   else {
   // The image is not updated :  Sauce as JSON
   // ============================================

    console.log (funcName + " No  image to update   ");
    const sauceObject = { ...req.body } ;
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
         console.log (funcName + " OK sauce updated -  id   = ", req.params.id);
         console.log("============");
         res.status(200).json({ message: 'Sauce modifiée avec succès !' })
        })
        .catch(error => res.status(400).json({ error }));

   }

*/

}



// 5. LIKE  DISLIKE SAUCE     
// /api/sauces/:id/like
// { userId: String, like: Number }
// { message: String }

    exports.likePost = (req, res, next) => {

        const funcName =  scriptname + ' - likePost : ';


/*

        const userId = req.body.userId;
        const like = req.body.like;
      
        console.log("============");
        console.log (funcName + " userId   ", userId);
        console.log (funcName + " like   ", like);
        console.log (funcName + " sauce id   ", req.params.id);

         // Search for a sauce with the id 
        Sauce.findOne({_id: req.params.id})
        .then((sauce) => {

             // Get the  likes 
             let usersLiked =  sauce.usersLiked;
             let usersDisliked =  sauce.usersDisliked;
            let new_usersLiked = [];
            let new_usersDisliked =  [];


             // Get the unlikes   

            console.log (funcName + " sauce found   ", sauce);
            switch (like) {
                case 0: 
                    // the user cancels his choice 
                    // so we need to remove the user from the like list or dislike list 
                    // https://developer.mozilla.org/fr/docs/Learn/JavaScript/First_steps/Arrays

                    let l_liked = usersLiked.length;
                    new_usersLiked = usersLiked.filter (function(value, index, arr){ 
                        return userId != value ; });

                   
                    new_usersDisliked = usersDisliked.filter (function(value, index, arr){ 
                            return userId != value ; });
   
                    break;
                case 1 :   
                    // the user likes 
                    // add the user in the like list 
                    usersLiked.push (userId);
                    new_usersLiked = usersLiked;
                    new_usersDisliked = usersDisliked;
                    break;
                case -1 :   
                // the user does not like 
                // add the user in the dikslike list  
                    usersDisliked.push (userId);
                    new_usersDisliked = usersDisliked;
                    new_usersLiked = usersLiked;
                    break;
        
            }

            console.log (funcName + " new usersLiked   ", new_usersLiked);
            console.log (funcName + " new usersLiked  length  ", new_usersLiked.length);
            console.log (funcName + " new usersDisliked   ", new_usersDisliked);
            console.log (funcName + " new usersLiked  length  ", new_usersDisliked.length);
            // Update the sauce 
            const newSauceLikeDislike = {
                usersLiked: new_usersLiked,
                usersDisliked: new_usersDisliked,
                likes: new_usersLiked.length,
                dislikes: new_usersDisliked.length
            }

            Sauce.updateOne({ _id: req.params.id }, {...newSauceLikeDislike, _id: req.params.id})
            .then(()=> res.status(201).json({message: 'like/dislike mis à jour.'}))
            .catch(error => res.status(400).json({error}));


        })
        .catch(error => res.status(400).json({error}));
       
*/
  

}

console.log (scriptname + 'end');
