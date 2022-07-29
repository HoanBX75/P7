import { useState, useEffect } from "react";
import Header from "../components/Header";
import Post  from "../components/Post";
import { Link, useNavigate } from 'react-router-dom'
import { Loader } from '../styles/Atoms'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import communicate from '../icons/communicate.jpg'

const HomeCompName = 'Home.js';




/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Home()
 Description : 
  This function is handling the main page of the application.
  It displays : 
    - a header 
    - and a list of posts  
 
  Two states are defined :
    posts : contain the list of all the posts obtained  from the backend 
    effectstatus : a status that is set to trigget the useEffect() function 
    that will fetch the posts.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
 */

function Home(props) {

  const [posts, setPosts] = useState([]);
  const [effectstatus, setEffectstatus] = useState(1);
  const navigate = useNavigate();

  const   HomeCompName = 'Home.js/Home()';

 
/* 
=========================================================== 
            Miscellaneous Funtions 
=========================================================== 
*/
 
/* Function getToken() : returns the user token in LocalStorage else null */ 
function getToken () {
    let user = localStorage.getItem("user");
    if (user) {
      let o_user =  JSON.parse (user);
      return (o_user.token);
    }
    else {
      return null;
    }  
}

/* Function isConnected() : returns true  user connected else false  */ 
function isConnected (){
      let user = localStorage.getItem("user");
      if (user) return (true);
      return (false);
}

/* Function getHeaderState() : returns 3 to display the Home header and 0 if the user 
                               is not connected */ 

function getHeaderState () {
        if (isConnected() ) {
            return (3);  /* All posts */ 
        }
        return (0);
}

/* Function displayText() : dipslays the Post text in a window */ 
function displayText (text) {
  alert (text);
}

/* 
  =================================================================================== 
  Function : refreshPosts()
  Description : 
   This function is the call back invoked when clicking on the refresh buttons
   It sets the Effectstatus to 4 , so that the useEffect () function is called 
   to fetch the posts from backend.
  ================================================================================== 
*/  
async  function refreshPosts() {
  let funcName  = 'Home.js/Home()/refreshPosts()';
  traceLog_line ();
  traceLog_msg (1,  funcName , '   begin / end  ' );
  setEffectstatus (4);  /* refreshPosts */
}

/* 
  =================================================================================== 
  Function : useEffect()
  Description : 
    This function is in charge of getting all the posts 
    when effectstatus has specified values.
    And updating the posts state.

    The depedency list is effectstatus.
    If the effectstatus is equals to : 
     1 : a post update, post new, a start  has been done 
     3:  a post delete has been done 
     4:  a resfresh on the post list done 
     In those cases : 
        a request is sent to the back to fetch all the posts.
        effectstatus is set to 10 : indicating that
              a http GET request is beeing processed  
        And, When the http get request is done 
        The state posts is set to the posts obtained.
        The effectstatus is set to 20 (ok), 21 (nok)

    22 (No user is connected)

   ================================================================================== 
*/
useEffect(() => {
    let funcName  = 'Home.js/Home()/useEffect()';
    traceLog_line ();
    traceLog_obj (1,  funcName , ' effectstatus = ', effectstatus  );
    
    switch (effectstatus) {
      case 1: break;     /* update, add, init */
     /* case 2 : break ;    like */
      case 3 : break ;  /* delete */
      case 4 : break ;  /* refresh */
      default :   /* 10 treatment en cours, 20 - 29 : traitment fait ,  0 acknowledment  */
         traceLog_msg  (1,  funcName , '  No treatment ');
         return;
    }

    traceLog_msg  (1,  funcName , ' Launching Treatment ');
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
          traceLog_obj (1,  funcName , ' Response data   ', data  );
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
      traceLog_obj (1,  funcName , '  Not connected  token   ', token  );
      setEffectstatus (22);
      setPosts([])
    }  
 }, [effectstatus]);


/* 
  ========================================================================= 
  Function : displayAllPosts()
  Description : 
   if the user is logged in, this function display all the posts.
   If there is no user logged, then it displays a welcomme message 
   ========================================================================= 
*/
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


        traceLog_obj (1,  funcName , ' effectstatus =  ', effectstatus );
        traceLog_obj (1,  funcName , ' cur_username =', cur_username );
        traceLog_obj (1,  funcName , ' cur_user_isAdmin =', cur_user_isAdmin );
        traceLog_obj (1,  funcName , ' posts ', posts );  
        traceLog_msg (1,  funcName , ' Display  Posts      ' );

       // The useEffect () function getting the posts from backend  
       // A waiting lader animation is displayed  
      if (effectstatus === 10) {
          return ( 
            <div className='xloader'><Loader /> </div>
          )
      }

      // Return  all the posts obtained from the useEffect get Posts results 
      // ---------------------------------------------------------------------
      return (
        <div>
              <div class='post_body'>
              <h2 class='connect_title'>Browse Our Posts </h2>
              </div>
              <div class='refresh_button_container'>
              <div className='refresh_button' onClick={() => refreshPosts ()}><button>👇🏻 Refresh </button></div>
              </div>
              <div class='no_post_message'> {(posts.length == 0)? <p>No post at the moment ! </p> :null } 
              </div>

              <div class="posts">

                  {posts.map(({ _id, title, text, imageUrl, userId, userName,  
                                postDate, usersLiked,
                            }) => (
                               <Post   _id={_id}   title={title}   text={text}  imageUrl={imageUrl}
                                       userId={userId} userName={userName} 
                                       postDate={postDate} usersLiked={usersLiked}  
                                       setEffectstatus={setEffectstatus}
                                />
                   ))}
              </div>
              <hr/>
        </div>
      ); // end of return;

   }  // end -of if connected  
   else {
         /* else : Not connected */
        return(
        <div class='connect_body'>
         <h2 class='connect_title'>Welcome to our Community!</h2> 
         <p class='connect_text'>   Just Sign up, Log in, and Post    </p>
         <img  className='home_communicate_image' src={communicate} alt="logo Groupomania"/>
        </div>
        )
   }  // end of -else 
} // end of  function  displayAllPosts 
/* ================================================================== */



/* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The home component displays 
       - A header 
       - if user connected, all the posts are displayed 
         else a welcome message  
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 

*/

traceLog_line ();
traceLog_msg (1,  HomeCompName , '******* RETURN *****');
return (
        <div>
         <Header  state={getHeaderState()} user={getLocalStorageUser()}/>
          {displayAllPosts()} 
        </div>
);    

}   // end of function Home
/* *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- */


traceLog_msg (1,  HomeCompName , 'loaded');
export default Home;

