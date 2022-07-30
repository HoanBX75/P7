import { useParams } from "react-router-dom"
import {  useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import Header from "../components/Header";
import { useState, useEffect } from "react";
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import {traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'

const UpdatePostCompName = 'UpdatePost.js';

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : UpdatePost()
 Description : 
  This function takes text, image from a Form, and 
  sends (HTTP put) them to the back end to update a post. 

  The processing is the following:
    - an HTTP request to get the post data via the useEffect() function.
    - The data is used as default value for the form 
    - The form is displayed (asking for atext and an image)
     - After clicking on the button Update, on onSubmit() function is called :
         A put http request is sent to update the post in the backend 
         And, then the home page is displayed 

 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
*/

function UpdatePost (){
    const { register, handleSubmit } = useForm()
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState()   
    const [postText, setPostText] = useState('')  

    const navigate = useNavigate()
    const params = useParams()

    const UpdatePostCompName = 'UpdatePost.js/UpdatePost()';
    let post_id = params.id;


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'onSubmit()' function 
 This function is invoking when clicking on the submit 
 button (Update)
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

  const onSubmit = async (data) => {

    let funcName =  UpdatePostCompName +  "/onSubmit () : " ; 

    traceLog_line ();
    traceLog_obj (1,  funcName , 'Input Form data ', data );
    traceLog_obj (1,  funcName , 'urlImage ', data.image[0] );
    traceLog_obj (1,  funcName , 'text ', data.text );
    
    /* Checking on the text field */
    /* --------------------------- */
    if (data.text == null)
    {
      setError("Unexpected Error on the Text field!")
      return;
    }
    else {
      if (data.text.length == 0) {  /* The text field must not be empty */
        setError(" Please, fill the Text field !  ")
        return;
      } 
    }

    let s_user  = localStorage.getItem ("user");   
    let user = JSON.parse (s_user);
    traceLog_obj (1,  funcName , 'localStorage user  ', user  );
    traceLog_obj (1,  funcName , 'localStorage user.token  ', user.token  );
    traceLog_obj (1,  funcName , 'localStorage user.userid  ', user.userid  );

    /* Prepare FormData */
    /* ---------------- */

    let formData = new FormData();
    formData.append("userName", user.username)
    formData.append("text", data.text)
    formData.append("userId", user.userid)
    formData.append("image", data.image[0])

    traceLog_obj (1,  funcName , 'formData.values  ', formData );

    let token =     user.token;
    let url_update = "http://localhost:3000/api/post/" + post_id;
    traceLog_obj (1,  funcName , 'url_update  ', url_update );

     /* Send PUT http request to update the post  */
    /* ------------------------------------------ */

    await fetch(url_update, {
        method: 'PUT',
        headers: {
          'authorization': 'bearer ' + token,
        },
        body: formData,
      })
      .then((res) => {

        if (res.ok) {
        traceLog_msg (1,  funcName , 'Post  Updated  OK  ' );
        traceLog_obj (1,  funcName , 'Post Updated  res ', res  );
        }
        else {
            traceLog_msg (1,  funcName , 'Post   NOT  Updated   ' );
            traceLog_obj (1,  funcName , 'Post  NOT Updated   ', res  );
            throw 'Cannot update Post '
        }

      })
      .catch(err => {
        traceLog_obj (1,  funcName , 'Post updated ERROR    ', err );
        alert ('Cannot Update Post - Error ', err);
      }) ;

    traceLog_msg (1,  funcName , 'End ' );

    // Go to the Home page   
    // -------------------

     navigate ("/");
  } 

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  useEffect() function 
 Descritpion : 
    This function is here intended to be invoked  to 
    fetch the post data  using the fetchPost() function 
     that will be used to populate      the default form value 
     (as the text field).

 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

 useEffect(() => {

    /* 
     ===========================================================
     Function fetchPost()
     ===========================================================
    */

    async function fetchPost(id, token) {  
      let funcName  =  UpdatePostCompName + '/useEffect/fetchPost()';

      traceLog_msg (1,  funcName , 'BEGIN  '  );

      let url_get = "http://localhost:3000/api/post/" + id; 
      try {
        const response =    await  fetch(url_get, {
            method: 'GET',
            headers: {
              'authorization': 'bearer ' + token,
            },
          });

        const post  = await response.json()
        traceLog_obj (1,  funcName , ' Get Response Post =  ',  post   );
        // Set the Post text state 
        // -----------------------
        setPostText (post.text);
      } catch (err) {
        traceLog_obj (1,  funcName , 'ERROR  err =  ', err  );
        alert ('Cannot get the post Error = ', err );  

      } finally {
        traceLog_msg (1,  funcName , 'END  '  );
      }
    }  /* end of function fetchPost */
    // ==========================================================================

    let l_user = getLocalStorageUser();
    let funcName = UpdatePostCompName + '/useEffect()';
    traceLog_line ();
    traceLog_obj (1,  funcName , 'BEGIN : post_id = ', post_id  );
    traceLog_obj (1,  funcName , 'BEGIN : user_token =', l_user.token  );
    traceLog_obj (1,  funcName , 'BEGIN : isDataLoading =', isDataLoading);

   
    if (!isDataLoading) {
        setDataLoading (true);
        traceLog_msg (1,  funcName , 'FETCHING POST '  );
        let l_post =   fetchPost  (post_id, l_user.token);
        traceLog_obj (1,  funcName , 'Promise obtained ', l_post  );
    }

}, [isDataLoading])


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'resetError()' function 
 This function is invoked for resetting 
 the error displayed.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
const resetError = () => {
  let funcName  =  UpdatePostCompName + '/resetError()'; 
  traceLog_msg (1,  funcName , 'Begin/End');
  setError("")
}


/* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The UpdatePost  component displays 
    + a Header 
    + a Title : Update your post
    + a text : Change your Text, Image:
    + a Form consisting of 
       - an input Text
       - an input Image File (no default is provided for security reason)
       - a submit button
        - an error message (if an error occurs)
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

traceLog_line ();
traceLog_obj (1,  UpdatePostCompName , ' ****** BEGIN ****** post_id = ', post_id  );
traceLog_msg (1,  UpdatePostCompName , '****** RETURN ********');  

return (
  <div className='page_main'>
        <Header state={5} user={getLocalStorageUser()}/>
     
        <div class='connect_body'>
            <h2 class='connect_title'>Update Your Post </h2>
            <p class='connect_text'>Change your Text, Image:  </p> 
            <div>
               
                <div class='addPost_form_container'>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div class='upd_form_element'>
                        <div class='upd_label'>
                            <label htmlFor="texte">Text</label>
                        </div>
                        <textarea {...register('text')} defaultValue={postText} 
                                    type="text" 
                                    rows="3" cols="100" autoFocus maxLength={500} id="texte"
                                    onChange={resetError} />
                    </div>

                    <div class='upd_form_element'>
                        <div class='upd_label'> 
                            <label htmlFor="texte">Image</label> 
                        </div> 
                        <input {...register('image')} aria-label="Update an Image " 
                                type="file"  />
                    </div>

                    {error ?
                        <><div className='connect_form_error'>{error}</div><br></br></> : null}  

                    <button>⭕ Update</button>

                </form>
            </div>

            </div>
          </div>

    </div>
);    


}
traceLog_msg (1,  UpdatePostCompName , 'loaded');
export default  UpdatePost 
