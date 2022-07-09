import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

function Signup (){

    // p7a conncectionForm  https://react-hook-form.com/
    console.log (" Signup : begin ");

    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()
    const navigate = useNavigate()

/* ------------------------ */    
    const onSubmit = (data) => {
        if (data.password === "" || data.email === "") {
            setError("Veuillez remplir tous les champs")
        }
        else {
// do the request 
            console.log ("signup data :  " , data );
            // Enregistrer le token et le user renvoyé par la base 
           
            localStorage.setItem( "token" , data.password);
            localStorage.setItem( "user" ,  data.email);
            navigate("/");
        }
    }
   
/* ------------------------ */ 
    const resetError = () => {
        setError("")
    }
/* ------------------------ */    


    return (
        <div>
            
      <Header  state={1}/>

        <form onSubmit={handleSubmit(onSubmit)}>
             <div>
                <label htmlFor="name">Name</label>
                <input {...register('name')} type="text" onChange={resetError} id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input {...register('email')} type="email" onChange={resetError} id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={resetError} {...register('password')} id="password" />
            </div>
            {error ?
                <><div>{error}</div><br></br></> : null}
            <button>Sign up</button>
        </form>

    </div>
    );   
}

export default Signup;
