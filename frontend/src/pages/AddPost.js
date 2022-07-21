
import { Link } from 'react-router-dom'
import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'
import  "../styles/index.css"

/* ------------------------------------------------- */
const LoginCompName = 'AddPost.js';
traceLog_msg (1,  LoginCompName , 'begin');


function AddPost (){

    let  LoginCompName = 'AddPost.js/AddPost()';  
    traceLog_line ();
    traceLog_msg (1,  LoginCompName , 'begin');

    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()


/* ------------------------ */    
    const onSubmit = async (data) => {
      
        traceLog_obj (1,  LoginCompName , 'Input Form data ', data );
        traceLog_obj (1,  LoginCompName , 'urlImage ', data.image[0] );
       //  formdata.append("urlImage", data.image[0])

      // faire une requete vers le backend 
      // https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData
     // https://fr.javascript.info/formdata

     let s_user  = localStorage.getItem ("user");   
     let user = JSON.parse (s_user);
     traceLog_obj (1,  LoginCompName , 'localStorage user  ', user  );
     traceLog_obj (1,  LoginCompName , 'localStorage user.token  ', user.token  );
     traceLog_obj (1,  LoginCompName , 'localStorage user.userid  ', user.userid  );

     let formData = new FormData();
     formData.append("userName", user.username)
     formData.append("text", data.text)
     formData.append("title", data.title)
     formData.append("userId", user.userid)
     formData.append("image", data.image[0])

    traceLog_obj (1,  LoginCompName , 'formData.values  ', formData.toString() );

    let token =     user.token;
    /*
    for (let value of formData.values()) {
        console.log(value);
        console.log([value][0]);
      };
     */  

     await fetch("http://localhost:3000/api/post/add", {
        method: 'POST',
        headers: {
          'authorization': 'bearer ' + token,
        },
        body: formData,
      })
      .then((res) => {

        traceLog_msg (1,  LoginCompName , 'post added  ' );
        traceLog_obj (1,  LoginCompName , 'post added  res ', res  );


      })
      .catch(err => console.log(err)) ;

      traceLog_msg (1,  LoginCompName , 'ZZZZZZZZZZZZZZZZZZZZ ' );
      
       navigate ("/");
    } // end of onSubmit

  

/* ------------------------ */ 
const resetError = () => {
    let  LoginCompName = 'AddPost.js/resetError()';  
    traceLog_msg (1,  LoginCompName , 'setError ()');
    setError("")
}
/* ------------------------ */    

traceLog_msg (1,  LoginCompName , 'return');  

return (
<div>
     
    <Header  state={4} user={getLocalStorageUser()}/>
    <div class='connect_body'>
         <h2 class='connect_title'>Send  Your New Post  </h2>
         <p class='connect_text'>Just Provide a Text, an Image File    </p> 
         <div class='addPost_form_container'>
         <form onSubmit={handleSubmit(onSubmit)}>
         <div>
            <div>
                <label htmlFor="titre">Title</label>
            </div>
            <textarea {...register('title')} type="text" rows="1" cols="100" autoFocus maxLength={255} id="titre" />
        </div>

        <div>
            <div>
                <label htmlFor="texte">Text</label>
            </div>
                <textarea {...register('text')} type="text" rows="3" cols="100" maxLength={500} id="texte" />
        </div>
        <div>
                <input {...register('image')} aria-label="Ajouter une image" type="file" />
        </div>
        <button>Add a Post</button>
        {error ?error : null}
        </form>
        </div>

    </div>
</div>  
);    


}  //  end of  AddPost

traceLog_msg (1,  LoginCompName , 'end');
export default AddPost;    