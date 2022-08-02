import  "../styles/index.css"
import {  useNavigate } from 'react-router-dom'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import { useState, useEffect } from "react";

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Post()
 Description : 
  This function displays a Post.
  It displays : 
       - A PostInfo (author, date)
       - A Text  
       - A number of likes 
       - Buttons (like, delete , update) 

   The handling of the 'like Post' of 'delete Post' is handled.
   The update post is handled by  the UpdatePost.js by invoking its 
   page.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
 */
function Post (props) {

    const [postEffectstatus, setPostEffectstatus] = useState(0);
    const [post, setPost] = useState(null);
    const [displayAllText, setDisplayAllText] = useState(false);
  
    const navigate = useNavigate();

    let funcName = 'Post.js/Post()';
 
    let  {_id, title, text, imageUrl, userId, userName,  postDate, usersLiked,
        setEffectstatus
          } = props;
       
    if (post) {
        usersLiked = post.usersLiked ;
        title = post.title;
        text = post.text;
        imageUrl = post.imageUrl;
    }

    traceLog_line ();
    traceLog_obj (1,  funcName , 'props = ', props);
    traceLog_obj (1,  funcName , 'postEffectstatus = ', postEffectstatus);    
    traceLog_obj (1,  funcName , 'post = ', post);

    if (postEffectstatus == 20)
    {       
        traceLog_obj (1,  funcName , 'usersLiked.length = ', usersLiked.length);
        setPostEffectstatus (0)
    }

    const current_user = getLocalStorageUser ();
    const cur_username =  current_user.username;
    const cur_userid = current_user.userid ; 
    const cur_token = current_user.token ; 
    const cur_usertype  = current_user.usertype ; 
    const cur_user_isAdmin = (cur_usertype == 'admin' ? true : false);

/* 
=================================================================================== 
            Miscellaneous Funtions 
=================================================================================== 
*/          

/* ------------------------------------------------------------------------ */
/* Function  getToken() : gets the user token stored in the localStorage    
   ------------------------------------------------------------------------*/
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

/* ------------------------------------------------------------------------ */
/* Function  getUsername() : gets the  username stored in the localStorage    
   ------------------------------------------------------------------------*/

function getUsername ()
{
            let user = localStorage.getItem("user");
            if (user) {
              let o_user =  JSON.parse (user);
              return (o_user.username);
            }
            else {
              return null;
            }  
}


/* ------------------------------------------------------------------------ */
/* Function  getStringTime() : generates a date from a date string
   with this format : Thursday, July 28, 2022 at 18:16:05                   
   ------------------------------------------------------------------------ */ 
function getStringTime(s_date) {
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

/* ------------------------------------------------------------------------ */
/* Function  isUserLiking() : returns true if the user  connected likes 
                                        else false 
   ------------------------------------------------------------------------ */ 
function isUserLiking ( cur_userid, usersLikesList)  {
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

/* 
  =================================================================================== 
  Function : check_ToDisplaySeeMore()

  Description : 
      This function is invoked from the useEffect() function
      This function verifies whether the entire post text can be 
      displayed.
      If it cannot, then the visibility of the element will be set 
                     to visible.
      Note that by default , it is set to hidden as  in  the css file : 
      .read-more-text_container  {
                 visibility: hidden;
        }

   Input 
     postId : post id of a post 
 
   ================================================================================== 
*/

function check_ToDisplaySeeMore (postId)
{ 
   let b =  false; 
   
   let  element =  document.getElementById(`postText-${postId}`);
   if (element == null) {
       return (false);
   }

   // Check here if the text enters in the element without scrolling 
   // -----------------------------------------------------------------
   if (element.offsetHeight < element.scrollHeight ||
       element.offsetWidth < element.scrollWidth) {
       document.getElementById(`read-more-${postId}`).style.visibility = "visible";
       return (true );
   } else {
      // dont render the component 
      document.getElementById(`read-more-${postId}`).style.height="0px";
      return (false );
   }
}

/* 
  =================================================================================== 
  Function : displayText()

  Description : 
      This function does the following : 
            - set the state of the DisplayAllText 
      It is invoked when clicking on the See more or See less button.
   Input 
     postId : post id of a post (it is passed just for the trace)
     flag_all : true  all the text needs to  be displayed
                false  the text will fit  to the display area    
   ================================================================================== 
*/

function displayText (postId,  flag_all) {
   let funcName = 'Post.js/Post()/displayAllText()';
   traceLog_obj (1,  funcName , 'postId = ', postId);
   traceLog_obj (1,  funcName , 'flag_all = ', flag_all);
   // let  element =  document.getElementById(`postText-${postId}`);
   setDisplayAllText(flag_all);
 }

/* 
  =================================================================================== 
  Function : likePost()

  Description : 
      This function is invoked when clicking on the post Like  button.
      This functions does the following : 
            - Send http Post  request  with the postId as parameter
             and the  dotheLike (0, 1 as value)
            - Invoke the Post setPostEffectstatus() state function 
             to  re-display the Post itself (by the useEffect function).
   Input 
     postId : post id of a post 
     dotheLike : 1  the user likes 
                 0  the user cancels his like
   ================================================================================== 
*/

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

    // Send HTTP POST  request to Like/UnLike a post 
    // ---------------------------------------------- 

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

        // Setting the Post PostEffectstatus  state to re-display the post
        // --------------------------------------------------------------        
        setPostEffectstatus (1);

    })
    .catch(err => console.log(err)) ;

    traceLog_msg (1,  funcName , ' End  ' );
}

/* 
  =================================================================================== 
  Function : deletePost()

  Description : 
      This function is invoked when clicking on the post delete  button.
      This functions does the following : 
            - Send http delete request  with the postId as parameter
            - Invoke the Home setEffectstatus() state function 
             to redisplay the Posts list (by the Home.js useEffect function) .
   Input 
     postId : post id of a post 

   ================================================================================== 
*/

 async function deletePost (id){
    let LoginCompName = 'Post.js/Post()/deletePost()';
    traceLog_line ();
    traceLog_obj (1,  LoginCompName , 'id = ', id);

    let token = getToken();
    let url_delete = "http://localhost:3000/api/post/" + id;
    
    
    // Send HTTP DELETE request to delete a post 
    // ------------------------------------------- 

   
  

    await  fetch(url_delete, {
      method: 'DELETE',
      headers: {
        'authorization': 'bearer ' + token,
      },
      
    })
    .then((res) => {

     
      traceLog_obj (1,  LoginCompName , 'delete post  RES ', res  );
   
      if (res.ok) {
      
        traceLog_msg (1,  LoginCompName , 'Post  Deleted   OK  ' );
        traceLog_obj (1,  LoginCompName , 'Post Deleted  res ', res  );
      }   
      else {
        traceLog_obj (1,  LoginCompName , 'Post  NOT Deleted    ', res  );
        throw 'Cannot Delete Post - status = ' + res.status 
      } 

     // Setting the Home  Effectstatus state to refresh the posts List 
     // ---------------------------------------------------------------
      setEffectstatus (3);  /* 3 indicates that 
                               the invoker is  deletePost() function  */
    })
    .catch(err => { 
        // An error has occured  when sending the http delete request 
        traceLog_msg (1,  LoginCompName , 'delete post  ERROR ', err );
        alert ('Error occured :  ' +  err);
        setEffectstatus (3); 
    }) ;

    traceLog_msg (1,  LoginCompName , 'delete end  ' );

  }

/* 
  =================================================================================== 
  Function : updatePost()

  Description : 
    This function is invoked when clicking on the post update button.
    It will then request the Update Post page by passing the id of the post 
    as a parameter.

   Input 
     postId : post id of a post 

   ================================================================================== 
*/

 function updatePost (id){
    let funcName  = 'Post.js/Post()/updatePost';
    traceLog_line ();
    traceLog_obj (1,  funcName , 'id = ', id);
    navigate (`post/update/${id}`)
}

/* 
  =================================================================================== 
  Function : useEffect()

  Description : 
    When a user has clicked on  Like/Unlike  button (postEffectstatus =1), 
    this function is in charge of getting a post  (Http get request ) 
    by using the postId. 
    This function is also in charge of checking if the SeeMore button 
    is to be enable if a post is too long.
 
    This function is setting the status to 2 to indicate that it is process 
    a Get request.
    When a post is obtained : 
           - postEffectstatus is postEffectstatus to 20 
           -  the state post is set to the post data (from date of the HTTP get response );

  Input 
     postId : post id of a post 

   ================================================================================== 
*/
   useEffect(() => {

    let funcName = 'Post.js/Post()/useEffect()';

    // Get the Post Id from the params 
    let postId = props._id;
    traceLog_line ();
    traceLog_obj (1,  funcName , 'postEffectstatus = ', postEffectstatus);
    traceLog_obj (1,  funcName , 'postId = ', postId);
   
    // Check the Post text size and whether to display the SeeMore button or not 
    // --------------------------------------------------------------------------
    check_ToDisplaySeeMore (postId);

    if (postEffectstatus == 1)
    {
        /* Setting  */    
        setPostEffectstatus (2);
        let token = getToken();
        traceLog_obj (1,  funcName , '  Token   ', token  );
        
        // Check the token is still available 
        // ---------------------------------
        if (getToken()) {

            // Send HTTP get request to get  post data
            // --------------------------------------- 
            let url_getOne = 'http://localhost:3000/api/post/' + postId;
            traceLog_obj (1,  funcName , '  Send getOne Post request =  ', url_getOne  );
             fetch(url_getOne, {
              method: 'GET',
              headers: {
              'authorization': 'bearer ' + token},
            
              })
              .then(response => response.json())
              .then(data => {
                 // Handle the response 
                 // -------------------
                  traceLog_obj (1,  funcName , 'OK  response data   ', data  );
                  setPost(data)
                  setPostEffectstatus (20);
              })
              .catch(err => {
                // Error :  Http request fails
                traceLog_obj (1,  funcName , ' ERROR when getting post Error = ', err   );
                setPostEffectstatus (21);
              });
          }
          else 
          {
            // Error :  user not connected
            traceLog_obj (1,  funcName , '  Not connected  token   ', token  );
            setPostEffectstatus (22);
            setPost([])
          }  

       return;
    }
   },[postEffectstatus])

/* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The Post  component displays 
       - A PostInfo (author, date)
       - A Text  
       - (A See more / See Less button) 
       - A number of likes 
       - Buttons (like, delete , update) 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 

*/

traceLog_msg (1,  funcName , ' *********** RETURN  ******** ' );

    return (
    <div className="post" key={`post-${_id}`}>
            <div className='post_info'>
                <div className='post_author_username'>    {userName}</div>
                <div className="post_date"> {getStringTime(postDate)}  </div>
            </div>   
   
            {!displayAllText?
            <div className='post_text_container' >
                <p id={`postText-${_id}`} className='post_text' dangerouslySetInnerHTML={{__html:text}}></p>
            </div>
            :<div className='post_text_container' >
                <p id={`postTextALL-${_id}`} className='post_text_all' dangerouslySetInnerHTML={{__html:text}}></p>
            </div>
            }


            {!displayAllText?
            <div id={`read-more-${_id}`} className='read-more-text_container'>
                    <div className='read-more_text_button' onClick={() => displayText (_id, true )}>   
                    ... See more   </div>
            </div> 
            : 
            <div id={`read-more-${_id}`} className='read-more-text_container'>
                    <div className='read-more_text_button' onClick={() => displayText (_id, false )}>   
                    See less ...   </div>
            </div> 
            }

                   
            <div className='post_image'>
                  <img   src={imageUrl} alt="" />
            </div>
            

            <div className='post_likes'>{usersLiked.length} Likes</div>
        
            <div className='post_separator'></div>
            <div className='post_space'> <br /> </div>
            <div className="post_buttons">
       
            { isUserLiking(cur_userid,usersLiked )?
                     <button  className='post_button' onClick={() => likePost ( _id, cur_token, cur_userid, 0)}>🤍 Unlike </button>
                     :
                     <button className='post_button'  onClick={() => likePost (_id,  cur_token, cur_userid, 1)}>🧡 Like </button>
             } 
        
            { cur_username === userName  || cur_user_isAdmin ?
                      <span>
                     <button className='post_button' onClick={() => deletePost (_id)}>❌ Delete</button>
                     <button className='post_button'onClick={() => updatePost (_id)}>⭕ Update</button>
                     </span>: null
            } 
            </div>
    </div>
    );  
}

export default Post;

