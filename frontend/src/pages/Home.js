import { useState, useEffect } from "react";
import Header from "../components/Header";

import { Link, useNavigate } from 'react-router-dom'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'


const LoginCompName = 'Home.js';
traceLog_msg (1,  LoginCompName , 'begin');



function Home(props) {

  const [posts, setPosts] = useState([]);
  const [posted, setPosted] = useState(false)

  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const   LoginCompName = 'Home.js/Home()';

  traceLog_line ();
  traceLog_msg (1,  LoginCompName , 'begin');
  const state = props.state; 
  traceLog_obj (1,  LoginCompName , 'state = ', state);
 


  /* ----------*/
  
  useEffect(() => {
    let  LoginCompName = 'Home.js/Home()';
    let funcName = LoginCompName + 'useEffect() : ';

    traceLog_line ();
    let token = getToken();
    console.log (funcName +  ' connected  token = ', token );

    if (getToken()) {
      // Get All the posts 
       fetch("http://localhost:3000/api/post", {
        method: 'GET',
        headers: {
        'authorization': 'bearer ' + token},
        })
        .then(response => response.json())
        .then(data => {

            console.log (funcName + 'fetch  - data = ', data); 
            setPosts(data)
            setPosted(true);
        
        })
        .catch(err => console.log(err));
    }
    else 
    {
      console.log (funcName +  ' Not connected  token = ', token );
      setPosts([])
    }  
 }, [posted]);
   //[posted, setPosted]);
  
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
    let LoginCompName = 'Home.js/Home()/updatePost';
    traceLog_obj (1,  LoginCompName , 'id = ', id);
     navigate (`post/update/${id}`)

     // `/post/edit/${element.id}`
   }

  /* ----------*/
   function likePost (id, name){
    let LoginCompName = 'Home.js/Home()/likePost()';
    traceLog_obj (1,  LoginCompName , 'id = ', id);
 
  }

  /* ----------*/
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
      setPosted(false);
     
     navigate ("/")

    })
    .catch(err => console.log(err)) ;

    traceLog_msg (1,  LoginCompName , 'delete end  ' );
  

  }

  /* ----------*/
   function displayAllPosts (){
   
   const  funcName = 'Home.js/displayAllPosts () :';
   
   console.log (funcName +  ' begin ');
   const current_user = getLocalStorageUser ();
  

   

   if (isConnected())
   {
    traceLog_obj (1,  LoginCompName , ' current current_user ', current_user );
    const cur_username =  current_user.username;
    
    traceLog_obj (1,  LoginCompName , ' cur_username =', cur_username );
    traceLog_obj (1,  LoginCompName , ' posts ', posts );

    return (
      <div>
       <h2>All Posts </h2>
      <ul >
      {posts.map(({ _id, title, text, imageUrl, userId, userName,  postDate  }) => (
        <div key={_id}>
          <br/>
            id = {_id} <br/>title={title } <br/>text = {text}<br/>
            imageUrl={imageUrl}  <br/> userId={userId}<br/>  userName={userName}<br/> 
            postDate={getStringTime(postDate)}  <br/>
            { cur_username === userName?
            <div>
            <button onClick={() => deletePost (_id, title)}>Delete</button><span>  </span>
            <button onClick={() => updatePost (_id, title)}>Update</button><span>  </span>
            </div>: null
            } 
            <button onClick={() => likePost (_id, title)}>Like</button>
        </div>
      ))}
      </ul>
      </div>
    );
   
   }
   else {
        
        return(
        <div>
         <p>  Let's communicate ! Connect and Post !   </p>
        </div>
        )
   }

  } 
/* ----------*/

/* ----------------------------------------------*/

traceLog_msg (1,  LoginCompName , 'return');  
return (
        <div>
            <Header  state={getHeaderState()} user={getLocalStorageUser()}/>
            {displayAllPosts()} 
        </div>
    );    


}   // end of function Home

traceLog_msg (1,  LoginCompName , 'end');
export default Home;
