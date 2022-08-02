import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState} from "react"
import {traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'

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
 This function is invoking when clicking on the submit 
 button (Send)
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
  
const onSubmit = async (data) => {
    let  AddPostFuncName = 'AddPost.js/AddPost()/onSubmit';  
    traceLog_line ();
    traceLog_obj (1,  AddPostFuncName , 'Input Form data ', data );
    traceLog_obj (1,  AddPostFuncName , 'urlImage ', data.image[0] );
   
    /*  Form Input checkings : text and Image file are mandatory */
    /* --------------------------------------------------------- */
    let l_error_msg = null;
     if (data.text =="")
     {
        traceLog_msg (1,  AddPostFuncName , "The Text  is empty");
        l_error_msg  =  "Please, fill the Text field!";
     } 

     if (data.image[0] == null)
     {
        traceLog_msg (1,  AddPostFuncName , "The Image  is not provided");
        if (!l_error_msg) l_error_msg  =  "Please, provide an Image file!";
        else  l_error_msg =  "Please, fill the Text field and provide an Image file!";
     } 


    if (l_error_msg != null)  {
        setError(l_error_msg)
        return;
    }
 

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
            alert ("Cannot create your new post! Error =  " + err);
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
       + Header 
       + a title : Share your New Post:
       + a text :  Just Provide your Text and Image:
       + a form consisting of 
        - a Text
        - an  Image File 
        - a submit button
        - an error message (if an error occurs)
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

traceLog_line ();
traceLog_msg (1,  AddPostFuncName , '****** RETURN ********');  

return (
<div className='page_main'>
     
    <Header  state={4} user={getLocalStorageUser()}/>

    <div className='connect_body'>
        <h2 className='connect_title'>Send Your New Post  </h2>
        <p className='connect_text'>Just Provide your Text and Image:  </p> 
        <div>

            
            <div className='addPost_form_container'>
         
                <form onSubmit={handleSubmit(onSubmit)}>
   
                    <div className='upd_form_element'>
                        
                        <div className='upd_label'>
                            <label htmlFor="texte">* Text </label>
                        </div>
                        <textarea {...register('text')} 
                                   type="text" 
                                   rows="3" cols="100" maxLength={500} id="texte" 
                                   onChange={resetError} />
                    </div>

                    <div className='upd_form_element'>
                        <div className='upd_label'>  
                             <label htmlFor="texte">* Image</label> 
                        </div> 
                        <input {...register('image')} aria-label="Add your image"
                                 type="file" 
                                 onChange={resetError}/>
                    </div>

                    {error ?
                        <><div className='connect_form_error'>{error}</div><br></br></> : null}  

                    <button>✍🏼 Send</button>
                </form>
            </div>

        </div>  
    </div>
</div>  
);    


}  //  end of  AddPost

traceLog_msg (1,  AddPostCompName , 'loaded');
export default AddPost;    
