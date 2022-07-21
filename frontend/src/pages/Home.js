import { useState, useEffect } from "react";
import Header from "../components/Header";

import { Link, useNavigate } from 'react-router-dom'
import { Loader } from '../styles/Atoms'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'

import communicate from '../icons/communicate.jpg'

const LoginCompName = 'Home.js';
traceLog_msg (1,  LoginCompName , 'begin');



/* =========================================================== */
function Home(props) {

  const [posts, setPosts] = useState([]);
  const [effectstatus, setEffectstatus] = useState(1);
  const navigate = useNavigate();
  const   LoginCompName = 'Home.js/Home()';

 //  const [user, setUser] = useState({});
 

    /* =========================================================== */
  
 /* ----------*/
  function getStringTime(s_date)
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

  /* ----------*/
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
  /* ----------*/
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
  /* ----------*/
  function isConnected (){
      let user = localStorage.getItem("user");
 


      if (user) return (true);
      return (false);
   }
  /* ----------*/

  function getHeaderState () {
        if (isConnected() ) {
            return (3);  /* All posts */ 
        }
        return (0);
  }
  /* ----------*/
   function updatePost (id, name){
    let funcName  = 'Home.js/Home()/updatePost';
    traceLog_obj (1,  funcName , 'id = ', id);
     navigate (`post/update/${id}`)

     // `/post/edit/${element.id}`
   }

   /* =========================================================== */
   async function likePost ( post_id, cur_token, cur_userid, dotheLike){
      let funcName = 'Home.js/Home()/likePost()';
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
        setEffectstatus (2);
   
       // navigate ("/")
  
      })
      .catch(err => console.log(err)) ;
  
      traceLog_msg (1,  funcName , ' End  ' );
    

    // navigate("/"); 

  }

  /* =========================================================== */
  async function deletePost (id, name){
    let LoginCompName = 'Home.js/Home()/deletePost()';
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
async  function refreshPosts() {
  traceLog_line ();
  let funcName  = 'Home.js/Home()/refreshPosts()';

  setEffectstatus (4);  /* refreshPosts */
  traceLog_msg (1,  funcName , '   begin / end  ' );
}

   /* =========================================================== */
   useEffect(() => {
    let funcName  = 'Home.js/Home()/useEffect()';
    traceLog_line ();
    traceLog_obj (1,  funcName , 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  effectstatus ', effectstatus  );
    
    switch (effectstatus) {
      case 1: break;     /* update, add, init */
      case 2 : break ;   /* like */
      case 3 : break ;  /* delete */
      case 4 : break ;  /* refresh */
      default :   /* 10 treatment en cours, 20 - 29 : traitment fait ,  0 acknowledment  */
         traceLog_msg  (1,  funcName , 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  No treatment ');
         return;
    }

    traceLog_msg  (1,  funcName , 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  treatment ');
    setEffectstatus (10);

    let token = getToken();
    traceLog_obj (1,  funcName , '  token  ', token  );

    if (getToken()) {
      // Get All the posts 
       fetch("http://localhost:3000/api/post", {
        method: 'GET',
        headers: {
        'authorization': 'bearer ' + token},
        })
        .then(response => response.json())
        .then(data => {
          traceLog_obj (1,  funcName , 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYY  response data   ', data  );
            setPosts(data)
            setEffectstatus (20);
        })
        .catch(err => {
          setEffectstatus (21);
          console.log(err)
        });
    }
    else 
    {
      traceLog_obj (1,  funcName , 'YYYYYYYYYYYYYYYYYYYYYYYYYYY  Not connected  token   ', token  );
      setEffectstatus (22);
      setPosts([])
    }  
 }, [effectstatus]);


  function displayText (text)
  {
    alert (text);
  }
  /* =========================================================== */
   function displayAllPosts (){
   
   const  funcName = 'Home.js/displayAllPosts () :';
   
  
   traceLog_msg (1,  funcName , ' begin ');

   const current_user = getLocalStorageUser ();
  
   if (isConnected())
   {
    traceLog_obj (1,  funcName , ' current current_user ', current_user );
    const cur_username =  current_user.username;
    const cur_userid = current_user.userid ; 
    const cur_token = current_user.token ; 
    const cur_usertype  = current_user.usertype ; 

   const cur_user_isAdmin = (cur_usertype == 'admin' ? true : false);


  
/*  */

    traceLog_obj (1,  funcName , ' ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ    effectstatus ', effectstatus );
  /* acknowledging use effect 
    if (effectstatus >= 20 ) {  
      setEffectstatus (0);
    }
    */

    traceLog_obj (1,  funcName , ' cur_username =', cur_username );
    traceLog_obj (1,  funcName , ' cur_user_isAdmin =', cur_user_isAdmin );
    traceLog_obj (1,  funcName , ' posts ', posts );
  
    traceLog_msg (1,  funcName , ' Display  Posts      ' );
    if (effectstatus === 10) {
      return ( <Loader />)
    }


    return (
      <div >
 
          <div class='post_body'>
          
          <h2 class='connect_title'>Browse Our Posts </h2>
          </div>

          <div class='refresh_button_container'>
          <button className='refresh_button' onClick={() => refreshPosts ()}>Refresh</button>
  </div>
         

<div class="posts">

{posts.map(({ _id, title, text, imageUrl, userId, userName,  postDate, usersLiked  }) => (



   <div className="post" key={`post-${_id}`}>

      <div class='post_info'>
          {title ? <h2 className='post_title'>{title}</h2> : null}
          <div className="post_date">{getStringTime(postDate)}   </div>
          <div class='post_author_username'>  by  {userName}</div>
             
      </div>

      

      <button className='post_text_button' onClick={() => displayText (text)}>
                 <div class='post_text'>{text}</div> 
      </button>


       <div class='post_image'>
       <img   src={imageUrl} alt="" />
       </div>
       <div class='post_likes'>{usersLiked.length} Likes</div>

       <div className="post_buttons">
       
        { isUserLiking(cur_userid,usersLiked )?
                      <button  className='post_button' onClick={() => likePost ( _id, cur_token, cur_userid, 0)}>Unlike</button>
                      :
                      <button className='post_button'  onClick={() => likePost (_id,  cur_token, cur_userid, 1)}>Like</button>
                      } 
                  
        { cur_username === userName  || cur_user_isAdmin ?
                       <span>
                      <button className='post_button' onClick={() => deletePost (_id, title)}>Delete</button>
                      <button className='post_button'onClick={() => updatePost (_id, title)}>Update</button>
                      </span>: null
                      } 
         
        </div>
     
   


   </div>
  

   ))}
</div>   

<hr/>
          <ol >  
          
              {posts.map(({ _id, title, text, imageUrl, userId, userName,  postDate, usersLiked  }) => (
                 <li>
                      <div key={_id}>
          
                      <b>postId</b>  {_id} <br/>
                      <b>title</b> {title } <br/>
                      <b>text</b>  {text}<br/>
                      <b>userName</b>   {userName}<br/> 
                    
                      <b>userId</b>  {userId}<br/>
                    
                      <b>likesNb</b> {usersLiked.length} <br/>
                      <b>likesUsers</b> {usersLiked.map (u => u + ' : ')}<br/>
                      <b>imageUrl</b> {imageUrl}  <br/>
                      <b>postDate</b> {getStringTime(postDate)}  <br/><br/>
                      { cur_username === userName  || cur_user_isAdmin ?
                      <div>
                      <button onClick={() => deletePost (_id, title)}>Delete</button><span>  </span>
                      <button onClick={() => updatePost (_id, title)}>Update</button><span>  </span>
                      </div>: null
                      } 
                      { isUserLiking(cur_userid,usersLiked )?
                      <button onClick={() => likePost ( _id, cur_token, cur_userid, 0)}>Unlike</button>
                      :
                      <button onClick={() => likePost (_id,  cur_token, cur_userid, 1)}>Like</button>
                      }
                    
                       </div>
                      <br/>
                   </li>   
              ))}
          </ol>
      </div>
    );
   
   }
   else {
     /* Not connected */

        return(
        <div class='connect_body'>
         <h2 class='connect_title'>Let's Communicate !</h2> 
         <p class='connect_text'>   Just sign up, log in, and post    </p>
         <img  className='home_communicate_image' src={communicate} alt="logo Groupomania"/>
        </div>
        )
   }

  } 
/* ----------

*/
/* =========================================================== */
traceLog_line ();
traceLog_msg (1,  LoginCompName , 'begin');
  
return (
        <div>
         <Header  state={getHeaderState()} user={getLocalStorageUser()}/>
            {displayAllPosts()} 
        </div>
    );    

}   // end of function Home
/* =========================================================== */
traceLog_msg (1,  LoginCompName , 'end');
export default Home;
