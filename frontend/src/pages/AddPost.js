
import { Link } from 'react-router-dom'
import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
/* ------------------------------------------------- */


function AddPost (){
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()



    const onSubmit = (data) => {
      
console.log ("addPost  data ", data);
      // faire une requete vers le backend 


      
       navigate ("/");
    }

return (
<div>
     
    <Header  state={4}/>
   <br/>
   <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <label htmlFor="titre">Title</label>
                    </div>
                    <textarea {...register('title')} type="text" rows="2" cols="100" autoFocus maxLength={255} id="titre" />
                </div>
                <div>
                    <div>
                        <label htmlFor="texte">Text</label>
                    </div>
                    <textarea {...register('text')} type="text" rows="5" cols="100" maxLength={500} id="texte" />
                </div>
                <div>
                    <input {...register('image')} aria-label="Ajouter une image" type="file" />
                </div>
                <button>Add a Post</button>
                {error ?
                    error : null}
            </form>
</div>  
);    


}

export default AddPost;    