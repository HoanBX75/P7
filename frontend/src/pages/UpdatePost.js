import { useParams, useLocation } from "react-router-dom"
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import Header from "../components/Header";
import { useState, useEffect } from "react";
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'


const UpdatePostCompName = 'UpdatePost.js';

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : UpdatePost()
 Description : 
  This function takes from a form : 
              Post text 
              An Image 
  sends them to the back end to update a post. 
  Then, sends an HTTP request to get the post data updated.
 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
 */

function UpdatePost (){
    const { register, handleSubmit } = useForm()
    const [isDataLoading, setDataLoading] = useState(false)
    const [error, setError] = useState(false)   
    const [postData, setPostData] = useState(null)
    const [postTitle, setPostTitle] = useState('')  
    const [postText, setPostText] = useState('')  

    const navigate = useNavigate()
    const params = useParams()
    const UpdatePostCompName = 'UpdatePost.js/UpdatePost()'
    let post_id = params.id;

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  useEffect() function 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

useEffect(() => {

        async function fetchPost(id, token) {  
            traceLog_msg (1,  UpdatePostCompName , 'fetchPost(()  begin '  );
            let url_get = "http://localhost:3000/api/post/" + id; 
          try {
            const response =    await  fetch(url_get, {
                method: 'GET',
                headers: {
                  'authorization': 'bearer ' + token,
                },
              });

            const post  = await response.json()
            traceLog_obj (1,  UpdatePostCompName , 'fetchPost()  Post =  ',  post   );
            setPostData (post);
           setPostTitle (post.title);
            setPostText (post.text);

           //  return (post)
          } catch (err) {
            traceLog_obj (1,  UpdatePostCompName , 'fetchPost() err ', err  );

          } finally {
            traceLog_msg (1,  UpdatePostCompName , 'fetchPost()  end '  );
           // return (null)
          }
        }
    
        let l_user = getLocalStorageUser();
        traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  begin : post_id', post_id  );
        traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  begin : user_token ', l_user.token  );


       
        if (!isDataLoading) {
            setDataLoading (true)
            let l_post =   fetchPost  (post_id, l_user.token);
            traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  POST  ', l_post  );
        }

    }, [])


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  getForm() function 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

    
  function getForm ()
  {
    if (!postData)
    {
        traceLog_obj (1,  UpdatePostCompName , ' getForm () begin yes : postData', postData  );
        return (<p> something </p>)
    }    
    else 
    {
        traceLog_obj (1,  UpdatePostCompName , ' getForm () begin  No : postData', postData  );
        return (<p> nothing  </p>)
    }
  }

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'onSubmit()' function 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

  const onSubmit = async (data) => {
    let funcName =  UpdatePostCompName +  "/onSubmit () : " ; 

    traceLog_line ();
    traceLog_obj (1,  funcName , 'Input Form data ', data );
    traceLog_obj (1,  funcName , 'urlImage ', data.image[0] );
    traceLog_obj (1,  funcName , 'text ', data.text );

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
   //  formData.append("title", data.title)
   formData.append("title", "ddfdfdf")
    formData.append("userId", user.userid)
    formData.append("image", data.image[0])

    traceLog_obj (1,  funcName , 'formData.values  ', formData.toString() );

  

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
        traceLog_msg (1,  funcName , 'post updated  OK  ' );
        traceLog_obj (1,  funcName , 'post updated  res ', res  );
        }
        else {
            traceLog_msg (1,  funcName , 'post   NOT  updated   ' );
            traceLog_obj (1,  funcName , 'post  NOT updated   ', res  );
            throw 'Cannot update Post '
        }

      })
      .catch(err => {
        traceLog_obj (1,  funcName , 'post updated ERROR    ', err );
        alert ('Cannot update post');
      }) ;

    traceLog_msg (1,  funcName , 'End ' );
    // Go to the Home page   
     navigate ("/");


  } 


/* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The UpdatePost  component displays a form consisting of 
       - a Text
       - an Image 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

traceLog_line ();
traceLog_msg (1,  UpdatePostCompName , '****** RETURN ********');  
traceLog_obj (1,  UpdatePostCompName , 'begin : post_id', post_id  );

return (
    <div>
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
                        <textarea {...register('text')} defaultValue={postText} type="text" 
                                    rows="3" cols="100" autoFocus maxLength={500} id="texte" />
                    </div>
                    <div class='upd_form_element'>
                        <div class='upd_label'> 
                            <label htmlFor="texte">Image</label> 
                        </div> 
                        <input {...register('image')} aria-label="Ajouter une image" type="file"  />
                    </div>
                  
                    <button>⭕ Update</button>
                    {error ?
                        error : null}
                </form>
            </div>

            </div>
          </div>

    </div>
);    


}
traceLog_msg (1,  UpdatePostCompName , 'loaded');
export default  UpdatePost 

/*
                <div>
                        <div>
                            <label htmlFor="titre">Post Title</label>
                        </div>
                        <textarea {...register('title')} defaultValue={postTitle} type="text" rows="1" cols="100" autoFocus maxLength={255} id="titre" />
                    </div>
                    */

/*
                    <div>
                        <div>
                            <label htmlFor="titre">Post Title</label>
                        </div>
                        <textarea {...register('title')} defaultValue={postTitle} type="text" rows="1" cols="100" autoFocus maxLength={255} id="titre" />
                    </div>
*/


/*
        <div class='connect_body'>
            <h2 class='connect_title'>Update Your Post </h2>
            <div>
                <p class='connect_text'>Change your Text, and Image:  </p> 
                <div class='addPost_form_container'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div>
                            <label htmlFor="titre">Post Title</label>
                        </div>
                        <textarea {...register('title')} defaultValue="dddd" type="text" rows="1" cols="100" autoFocus maxLength={255} id="titre" />
                    </div>
                    <div>
                        <div>
                            <label htmlFor="texte">Text</label>
                        </div>
                        <textarea {...register('text')} defaultValue={postText} type="text" rows="3" cols="100" maxLength={500} id="texte" />
                    </div>
                    <div>
                        <input {...register('image')} aria-label="Ajouter une image" type="file"  />
                    </div>
                    <button>Update</button>
                    {error ?
                        error : null}
                </form>
            </div>

            </div>
        </div>


*/

/*

                  <div>
                        <div>
                            <label htmlFor="titre">Post Title</label>
                        </div>
                        <textarea {...register('title')} defaultValue={postTitle} type="text" rows="1" cols="100" autoFocus maxLength={255} id="titre" />
                    </div>

 */                   