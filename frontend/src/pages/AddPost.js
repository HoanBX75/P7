import { Link } from 'react-router-dom'
import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import  "../styles/index.css"


const AddPostCompName = 'AddPost.js';

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : AddPost()
 Description : 
  This function takes from a form : 
              Post text 
              An Image 
  And them to the back end to create a post. 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
 */


function AddPost (){

    let  AddPostFuncName = 'AddPost.js/AddPost()';  
    traceLog_line ();
    traceLog_msg (1,  AddPostFuncName , 'begin');

    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'onSubmit()' function 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
  
const onSubmit = async (data) => {
    let  AddPostFuncName = 'AddPost.js/AddPost()/onSubmit';  
    traceLog_line ();
    traceLog_obj (1,  AddPostFuncName , 'Input Form data ', data );
    traceLog_obj (1,  AddPostFuncName , 'urlImage ', data.image[0] );


     let s_user  = localStorage.getItem ("user");   
     let user = JSON.parse (s_user);
     traceLog_obj (1,  AddPostFuncName , 'localStorage user  ', user  );

     // Prepare the form data 
     // ----------------------
     let formData = new FormData();
     formData.append("userName", user.username)
     formData.append("text", data.text)
     formData.append("userId", user.userid)
     formData.append("image", data.image[0])

    traceLog_obj (1,  AddPostFuncName , 'formData.values  ', formData.toString() );

    let token =     user.token;

     // Send the Post data to create a Post  
     // -------------------------------------

     await fetch("http://localhost:3000/api/post/add", {
        method: 'POST',
        headers: {
          'authorization': 'bearer ' + token,
        },
        body: formData,
      })
      .then((res) => {
            // Get the response from the HTTP request   
             // -----------------------------------------
             traceLog_msg (1,  AddPostFuncName , 'post added  ' );
             traceLog_obj (1,  AddPostFuncName , 'post added  res ', res  );
      })
      .catch(err => {
            traceLog_obj (1,  AddPostFuncName , 'HTTP request Error   ', err  );
      }) ;

      traceLog_msg (1,  AddPostFuncName , 'End' );
      
      // Go to the Home page 
      // -------------------
      navigate ("/");
} // end of onSubmit

  

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'resetError()' function 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
const resetError = () => {
    let  AddPostFuncName = 'AddPost.js/resetError()';  
    traceLog_msg (1,  AddPostFuncName , 'setError ()');
    setError("")
}
 
/* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The AddPost component displays a  
       a Header 
       a form consisting of 
        - a Text
        - an Image 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

traceLog_line ();
traceLog_msg (1,  AddPostFuncName , '****** RETURN ********');  

return (
<div>
     
    <Header  state={4} user={getLocalStorageUser()}/>

    <div class='connect_body'>
        <h2 class='connect_title'>Send  Your New Post  </h2>
        <p class='connect_text'>Just Provide your Text and Image:  </p> 
        <div>

            
            <div class='addPost_form_container'>
         
                <form onSubmit={handleSubmit(onSubmit)}>
   
                    <div>
                        <div>
                            <label htmlFor="texte">Text</label>
                        </div>
                        <textarea {...register('text')} type="text" rows="3" cols="100" maxLength={500} id="texte" />
                    </div>

                    <div>
                        <div> <label htmlFor="texte">Image</label> </div> 
                        <input {...register('image')} aria-label="Ajouter une image" type="file" />
                    </div>
                    <br/>
                    <button>✍🏼 Send</button>
                    
                    {error ?error : null}
                </form>
            </div>

        </div>  
    </div>
</div>  
);    


}  //  end of  AddPost

traceLog_msg (1,  AddPostCompName , 'loaded');
export default AddPost;    


       //  formdata.append("urlImage", data.image[0])
      // faire une requete vers le backend 
      // https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData
     // https://fr.javascript.info/formdata


/*

                 <div>
                        <div>
                            <label htmlFor="titre">Post Title</label>
                        </div>
                        <textarea {...register('title')} type="text" 
                                rows="1" cols="100" autoFocus maxLength={255} id="titre" />
                    </div>


*/

