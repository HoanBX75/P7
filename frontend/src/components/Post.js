
import  "../styles/index.css"

import { Link, useNavigate } from 'react-router-dom'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import logo from '../icons/icon-left-font.png'
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import { useState, useEffect } from "react";


/* =========================================================== */
function Post (props) {

    const [postEffectstatus, setPostEffectstatus] = useState(0);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

 
 
    let  {_id, title, text, imageUrl, userId, userName,  postDate, usersLiked,
        setEffectstatus
          } = props;
       
    if (post) {
        usersLiked = post.usersLiked ;
        title = post.title;
        text = post.text;
        imageUrl = post.imageUrl;
    }

    let funcName = 'Post.js/Post()';
    traceLog_line ();
    traceLog_obj (1,  funcName , 'props = ', props);
    traceLog_obj (1,  funcName , 'postEffectstatus = ', postEffectstatus);    
    traceLog_obj (1,  funcName , 'post = ', post);

    if (postEffectstatus == 20)
    {       
        traceLog_obj (1,  funcName , 'usersLiked.length = ', usersLiked.length);
        setPostEffectstatus (0)
    }


    //     setPost ({postId: _id});
   //   setPost ({postId: _id, title: title, text : text,  imageUrl : imageUrl, 
   //              userId : userId, userName : userName,  postDate : postDate, usersLiked : usersLiked})

    const current_user = getLocalStorageUser ();
    const cur_username =  current_user.username;
    const cur_userid = current_user.userid ; 
    const cur_token = current_user.token ; 
    const cur_usertype  = current_user.usertype ; 
    const cur_user_isAdmin = (cur_usertype == 'admin' ? true : false);

   
          

   /* =========================================================== */
   useEffect(() => {

    let funcName = 'Post.js/Post()/useEffect()';
    let postId = props._id;
    traceLog_line ();
    traceLog_obj (1,  funcName , 'postEffectstatus = ', postEffectstatus);
    traceLog_obj (1,  funcName , 'postId = ', postId);
   
    
    checkReadMore (postId);


    if (postEffectstatus == 1)
    {
        /* do the request */    
        setPostEffectstatus (2);
        let token = getToken();
        traceLog_obj (1,  funcName , '  Token   ', token  );
        

        if (getToken()) {
            // Get One Post
            let url_getOne = 'http://localhost:3000/api/post/' + postId;
            traceLog_obj (1,  funcName , '  Send getOne Post request =  ', url_getOne  );
             fetch(url_getOne, {
              method: 'GET',
              headers: {
              'authorization': 'bearer ' + token},
            
              })
              .then(response => response.json())
              .then(data => {
                traceLog_obj (1,  funcName , 'ZZZZZZZZZZZZZZZZZZZZZZZ  response data   ', data  );
                  setPost(data)
                  setPostEffectstatus (20);
              })
              .catch(err => {
                traceLog_obj (1,  funcName , 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYY  Error response data   ', err   );
                setPostEffectstatus (21);
                console.log(err)
              });
          }
          else 
          {
            traceLog_obj (1,  funcName , 'YYYYYYYYYYYYYYYYYYYYYYYYYYY  Not connected  token   ', token  );
            setPostEffectstatus (22);
            setPost([])
          }  

       return;
    }

   },[postEffectstatus])

   /* =========================================================== */
function getToken ()
{
            let user = localStorage.getItem("user");
            if (user) {
              let o_user =  JSON.parse (user);
              return (o_user.token);
            }
            else {
              return null;
            }  
}
   /* =========================================================== */
  function displayText (text)
  {
    alert (text);
  }

  function getStringTime(s_date)
  {
    let dateObj = new Date (s_date);
    let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

    let l_date = dateObj.toLocaleDateString("en-US", options);

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-formate
    
    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-formate
    
    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-formate
    
    const time = ` ${hour}:${minute}:${second}`;


    return (l_date + ' at ' + time);
  }

  function getStringTime2(s_date)
  {
    let dateObj = new Date (s_date);
    let year = dateObj.getFullYear();

    let month = dateObj.getMonth();
    month = ('0' + month).slice(-2);
    // To make sure the month always has 2-character-formate. For example, 1 => 01, 2 => 02
    
    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-formate
    
    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-formate
    
    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-formate
    
    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-formate
    
    const time = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
 
    return (time);
  }
     /* =========================================================== */
  function isUserLiking ( cur_userid, usersLikesList)
  {
    let res_userid = null;

    if (usersLikesList.length === 0 ) {
      return (false);
    }
    else {
      res_userid = usersLikesList.find (userid  => cur_userid ==  userid);
    }
    
    if (res_userid) {
      return (true);
    }
    else {
      return (false);
    }
  }

/* =========================================================== */
async function likePost ( post_id, cur_token, cur_userid, dotheLike){
    let funcName = 'Post.js/Post()/likePost()';
    traceLog_line ();
    traceLog_obj (1,  funcName , 'post_id = ', post_id);
    traceLog_obj (1,  funcName , 'cur_userid = ', cur_userid);
    traceLog_obj (1,  funcName , 'cur_token = ', cur_token);
    traceLog_obj (1,  funcName , 'dotheLike = ', dotheLike);



    const postData = { userid: cur_userid, 
                      dotheLike: dotheLike};


    let url_postlike = "http://localhost:3000/api/post/like/" + post_id; 

    traceLog (1,  funcName , 'send  HTTP post like  url =', url_postlike )
    /* ---------- */
    await fetch(url_postlike, {
      method: 'POST',
      headers: {
        'authorization': 'bearer ' + cur_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    .then((res) => {

      traceLog_msg (1,  funcName , 'Response Like OK   ' );
      traceLog_obj (1,  funcName , 'Response Like =  ', res  );

    //   setEffectstatus (2);
    setPostEffectstatus (1);
     // navigate ("/")

    })
    .catch(err => console.log(err)) ;

    traceLog_msg (1,  funcName , ' End  ' );
  

  // navigate("/"); 

}

/* =========================================================== */

 async function deletePost (id, name){
    let LoginCompName = 'Post.js/Post()/deletePost()';
    traceLog_line ();
    traceLog_obj (1,  LoginCompName , 'id = ', id);
    let token = getToken();
    let url_delete = "http://localhost:3000/api/post/" + id; 
    await  fetch(url_delete, {
      method: 'DELETE',
      headers: {
        'authorization': 'bearer ' + token,
      },
      
    })
    .then((res) => {

      traceLog_msg (1,  LoginCompName , 'delete post  ' );
      traceLog_obj (1,  LoginCompName , 'delete post  res ', res  );
   
      setEffectstatus (3);  /* deletePost */
      // navigate ("/")

    })
    .catch(err => console.log(err)) ;

    traceLog_msg (1,  LoginCompName , 'delete end  ' );

  }

/* =========================================================== */
 function updatePost (id, name){
    let funcName  = 'Post.js/Post()/updatePost';
    traceLog_obj (1,  funcName , 'id = ', id);
     navigate (`post/update/${id}`)

     // `/post/edit/${element.id}`
   }
/* =========================================================== */

function showReadMoreButton(element){

    console.log ( 'AAAAAAAAAAAAAAAAAAAAAAA   showReadMoreButton ', element ); 
    
    if (element.offsetHeight < element.scrollHeight ||
         element.offsetWidth < element.scrollWidth) {
         return (true );
     } else {
        return (false );
     }
    
 }
/* =========================================================== */
 function checkReadMore (postId)
 { 
    let b =  false; 
    
    let  element =  document.getElementById(`postText-${postId}`);
    if (element == null) {
        return (false);
    }


    if (element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth) {
        document.getElementById(`read-more-${postId}`).style.visibility = "visible";
        return (true );
    } else {
       return (false );
    }

 }



traceLog_msg (1,  funcName , ' *********** RETURN  ******** ' );

    return (
        <div className="post" key={`post-${_id}`}>
            <div class='post_info'>
                  {title ? <h2 className='post_title'>{title}</h2> : null}
                 <div className="post_date"> {getStringTime(postDate)}  </div>
                <div class='post_author_username'>  by  {userName}</div>
            </div>   
   

            <div className='post_text_container' >
                 <p id={`postText-${_id}`} class='post_text'>{text}</p>
            </div>
            
            <div>
            
            <div id={`read-more-${_id}`} class='read-more-text_container'>
            <div className='read-more_text_button' onClick={() => displayText (text)}>   
               Read More ...  </div>
            </div>  
            </div>
           
            <div class='post_image'>
                  <img   src={imageUrl} alt="" />
            </div>
            

          <div class='post_likes'>{usersLiked.length} Likes</div>

          <div className="post_buttons">
       
       { isUserLiking(cur_userid,usersLiked )?
                     <button  className='post_button' onClick={() => likePost ( _id, cur_token, cur_userid, 0)}>🤍 Unlike </button>
                     :
                     <button className='post_button'  onClick={() => likePost (_id,  cur_token, cur_userid, 1)}> 🧡 Like </button>
        } 
                 
       { cur_username === userName  || cur_user_isAdmin ?
                      <span>
                     <button className='post_button' onClick={() => deletePost (_id, title)}>❌ Delete</button>
                     <button className='post_button'onClick={() => updatePost (_id, title)}>⭕ Update</button>
                     </span>: null
        } 
        
       </div>
    

      </div>
    );  


}

export default Post;