import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'



const LoginCompName = 'Signup.js';
traceLog_msg (1,  LoginCompName , 'begin');


function Signup (){

    // p7a conncectionForm  https://react-hook-form.com/
    let  LoginCompName = 'Signup.js/Signup()';  
    traceLog_line ();
    traceLog_msg (1,  LoginCompName , 'begin');

    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()
    const navigate = useNavigate()

/* ------------------------ */    
    const onSubmit = async (data) => {
        let  LoginCompName = 'Login.js/onSubmit()';  
        traceLog_obj (1,  LoginCompName , 'Input Form data ', data );

        if (data.password === "" || data.email === "" || data.username === "" ) {
            traceLog_msg (1,  LoginCompName , 'Input Form Fields are not all filled!');
            setError("Please fill all the Form fields!")
        }
        else {
            // DO an http post to signup , in return get userid and token, username 
            const userSignup = { username: data.username, email: data.email, password: data.password};
            const request = { method: 'POST',headers: { 'Content-Type': 'application/json' },
                                                         body: JSON.stringify(userSignup)};   
            let api_url = "http://localhost:3000/api/auth/signup";

            let resp_ok = false;
            let token = null;
            let userid = null;
            let username = null;
            let usertype = null;
            let err_msg = '';

            /* ---------- */
            traceLog (1,  LoginCompName , 'send  HTTP post signup  url =', api_url );
 
            await fetch(api_url, request)
            .then(response => {
                traceLog_obj (1,  LoginCompName , 'HTTP post signup response =', response );
                if (response.ok) {
                    resp_ok = true;
                }   
                return (response.json());
            })
            .then(data  => {
                traceLog_obj (1,  LoginCompName , 'HTTP post  signup response body =', data );
                if (resp_ok) {
                    /*
                    Response data = {message: " "}
                    */
                    traceLog_obj (1,  LoginCompName , 'HTTP post signup OK  data  =', data  );
                }
                else 
                {
                    /*
                    Response data = {error : {message:  " .... "}}
                    */

                    traceLog_obj (1,  LoginCompName , 'HTTP post signup NOK  data  =', data  );
                    err_msg =  err_msg + data.error.message;
                }
            })
            .catch(err => {
                traceLog_obj (1,  LoginCompName , 'HTTP post Error =', err );
                err_msg =  err_msg + err;
            });
        
           /* ---------- */

            if (resp_ok) {
                traceLog_msg (1,  LoginCompName , 'Signup Succesfull'); 
            }
            else 
            {
                traceLog_msg (1,  LoginCompName , 'Signup  Failed');
                traceLog_obj (1,  LoginCompName , 'err_msg = ', err_msg );
                alert ('Signup fails : \n' + err_msg);
            } 

            navigate("/"); 

        }
        traceLog_msg (1,  LoginCompName , 'end');
        traceLog_line ();          
    }
   
/* ------------------------ */ 
    const resetError = () => {
        let  LoginCompName = 'Signup.js/resetError()';  
        traceLog_msg (1,  LoginCompName , 'setError ()');
        setError("")
    }
/* ------------------------ */    


    return (
        <div>
            
        <Header  state={1}/>
        <p>Please provide your credentials to sign up !</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">Email</label>
                <input {...register('email')} type="email" onChange={resetError} id="email" />
            </div>
             <div>
                <label htmlFor="username">Username</label>
                <input {...register('username')} type="text" onChange={resetError} id="username" />
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
traceLog_msg (1,  LoginCompName , 'end');
export default Signup;
