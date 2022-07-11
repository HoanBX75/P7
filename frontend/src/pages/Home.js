import { useState, useEffect } from "react";
import Header from "../components/Header";
import { postList } from "../datas/postList";
import { Link, useNavigate } from 'react-router-dom'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'


const LoginCompName = 'Home.js';
traceLog_msg (1,  LoginCompName , 'begin');

function Home() {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate()
  const   LoginCompName = 'Home.js/Home()';

  traceLog_line ();
  traceLog_msg (1,  LoginCompName , 'begin');
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
  function deletePost (id, name){
    let LoginCompName = 'Home.js/Home()/deletePost()';
    traceLog_obj (1,  LoginCompName , 'id = ', id);
  }

  /* ----------*/
  function getAllPosts (){
   if (isConnected())
   {

      // Get All the posts 
     
        return (
          <div>
          <p>  Here are the Posts :  </p>
          <ul >
          {postList.map(({ id, name, text  }) => (
            <div key={id}>
                id = {id} - name={name } - text = {text}
                <button onClick={() => deletePost (id, name)}>Delete</button><span>  </span>
                <button onClick={() => updatePost (id, name)}>Update</button><span>  </span>
                <button onClick={() => likePost (id, name)}>Like</button>
            </div>
          ))}
          </ul>
          </div>
        )     
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
            <Header  state={getHeaderState()}/>
            {getAllPosts()}
        </div>
    );    
}   // end of function Home

traceLog_msg (1,  LoginCompName , 'end');
export default Home;
