import { useParams, useLocation } from "react-router-dom"
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import Header from "../components/Header";
import { useState, useEffect } from "react";
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'





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


    useEffect(() => {
        /* ============== */
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
        /* ============== */

        let l_user = getLocalStorageUser();
        traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  begin : post_id', post_id  );
        traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  begin : user_token ', l_user.token  );


        // setPostData ({dodod:2})
        if (!isDataLoading) {
            setDataLoading (true)
            let l_post =   fetchPost  (post_id, l_user.token);
            traceLog_obj (1,  UpdatePostCompName , 'useEffect(()  POST  ', l_post  );
        }

    }, [])



    // setPostId (post_id);

  // =================================================================
    traceLog_line ();
    traceLog_obj (1,  UpdatePostCompName , 'begin : post_id', post_id  );
    traceLog_msg (1,  UpdatePostCompName , 'return ');
    
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

  /* ============== */

  const onSubmit = async (data) => {
    let funcName =  UpdatePostCompName +  "/onSubmit () : " ; 
    traceLog_msg (1,  funcName , '  begin  '  );
    traceLog_obj (1,  funcName , 'Input Form data ', data );
    traceLog_obj (1,  funcName , 'urlImage ', data.image[0] );

    let s_user  = localStorage.getItem ("user");   
    let user = JSON.parse (s_user);
    traceLog_obj (1,  funcName , 'localStorage user  ', user  );
    traceLog_obj (1,  funcName , 'localStorage user.token  ', user.token  );
    traceLog_obj (1,  funcName , 'localStorage user.userid  ', user.userid  );

    let formData = new FormData();
    formData.append("userName", user.username)
    formData.append("text", data.text)
    formData.append("title", data.title)
    formData.append("userId", user.userid)
    formData.append("image", data.image[0])

    traceLog_obj (1,  funcName , 'formData.values  ', formData.toString() );

   

    let token =     user.token;
    let url_update = "http://localhost:3000/api/post/" + post_id;
    traceLog_obj (1,  funcName , 'url_update  ', url_update );

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
      
     navigate ("/");


  } 
/*

  postid = {post_id} <br/>
     title = {postTitle} <br/>
     text = {postText} <br/>
     */
return (
    <div>
         <Header state={5} user={getLocalStorageUser()}/>
     <h2>Update Post </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <label htmlFor="titre">Title</label>
                    </div>
                    <textarea {...register('title')} defaultValue={postTitle} type="text" rows="2" cols="100" autoFocus maxLength={255} id="titre" />
                </div>
                <div>
                    <div>
                        <label htmlFor="texte">Text</label>
                    </div>
                    <textarea {...register('text')} defaultValue={postText} type="text" rows="5" cols="100" maxLength={500} id="texte" />
                </div>
                <div>
                    <input {...register('image')} aria-label="Ajouter une image" type="file"  />
                </div>
                <button>Modifier un post</button>
                {error ?
                    error : null}
            </form>

    </div>
);    


}

export default  UpdatePost 

