import { useParams, useLocation } from "react-router-dom"
import { Link, useNavigate } from 'react-router-dom'

import Header from "../components/Header";
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import { useState, useEffect } from "react";


function UpdatePost (){



    const UpdatePostCompName = 'UpdatePost.js/UpdatePost()'
    const navigate = useNavigate()
    const params = useParams()
    let post_id = params.id;
    console.log ( "UpdatePost params.id " + params.id);
 
    traceLog_obj (1,  UpdatePostCompName , 'post_id', post_id  );
   
    /* --*/
    useEffect(() => {
        traceLog_line ();
        traceLog_obj (1,  UpdatePostCompName , ' useEffect  zzzzzzzzzzzzzzzzzzzzzzzzzzzz  post_id', post_id  );

    }, []);;

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

    async function getPost(id)
    {
        let post= null;
        console.log ( "getPost " + id); 
    
        let token = getToken();
        let url_get = "http://localhost:3000/api/post/" + id; 
        await  fetch(url_get, {
          method: 'GET',
          headers: {
            'authorization': 'bearer ' + token,
          },
        })
        .then((res) => {
    
          traceLog_msg (1,  UpdatePostCompName , 'get   ' );
          traceLog_obj (1,  UpdatePostCompName , 'get  res ', res  );
          return  (res.json());
        //   navigate ("/")
    
        })
        .then (data => {
            traceLog_obj (1,  UpdatePostCompName , 'get  data ', data); 
           
            post = data;
          
        // console.log("DATA", data)
        }
        )
        .catch(err => console.log(err)) ;
    
        traceLog_obj (1,  UpdatePostCompName , ' the post to update ', post); 

        return post;
    }
 
    traceLog_line ();
    let post = getPost (post_id);
    traceLog_msg (1,  UpdatePostCompName , ' return xxxxxxxxxxxxxxxxxxxxxxxxxxx');
    
return (
<div>
     
    <Header state={5}/>
   <br/>
   postid = {post_id}
 
</div>  
);    


}

export default  UpdatePost 