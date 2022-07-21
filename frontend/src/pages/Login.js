import { useState, useEffect, useImperativeHandle } from "react";
import Header from "../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'

import  "../styles/index.css"

  // p7a conncectionForm  https://react-hook-form.com/

const LoginCompName = 'Login.js';
traceLog_msg (1,  LoginCompName , 'begin');

/* ------------------------------------------------- */
function Login (){
    let  LoginCompName = 'Login.js/Login()';    
    traceLog_line ();
    traceLog_msg (1,  LoginCompName , 'begin');
   
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()
    const navigate = useNavigate()
  

    /* ------------------------ */  
    const onSubmit = async (data) => {
        let  LoginCompName = 'Login.js/onSubmit()';    
        traceLog_obj (1,  LoginCompName , 'Input Form data ', data );

        if (data.password === "" || data.email === "") {
            traceLog_msg (1,  LoginCompName , 'Input Form Fields are not all filled!');
            setError("Please fill all the Form fields!")
        }
        else {
            // DO an http post to authenticate, in return get userid and token 
            
            const userLogin = { email: data.email, password: data.password};
            const request = { method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(userLogin)};          
            let api_url = "http://localhost:3000/api/auth/login";

            let resp_ok = false;
            let user = {userid : '', username : '',   usertype : '',   token : '' };
            let err_msg = '';
            

            traceLog (1,  LoginCompName , 'send  HTTP post url =', api_url )
            /* ---------- */
            await fetch(api_url, request)
            .then(response => {
                traceLog_obj (1,  LoginCompName , 'HTTP post response =', response );
                if (response.ok) {
                    resp_ok = true;
                }   
                return (response.json());
            })
            .then(data  => {
                traceLog_obj (1,  LoginCompName , 'HTTP post response body =', data );
                if (resp_ok) {
                    user.token = data.token;
                    user.userid = data.userid;  
                    user.username=  data.username;  
                    user.usertype = data.usertype;
                }
                else 
                {
                    err_msg =  err_msg + data.error;
                }
            })
            .catch(err => {
                traceLog_obj (1,  LoginCompName , 'HTTP post Error =', err );
                err_msg =  err_msg + err;
            });
            

            /* ---------- */
            if (resp_ok) {
                traceLog_msg (1,  LoginCompName , 'Login Succesfull');
                traceLog_obj (1,  LoginCompName , 'user = ', user );

                localStorage.setItem( 'user' , JSON.stringify(user));


                   let kk =     localStorage.getItem( 'user');
                   let user2 = JSON.parse(kk);
                   traceLog_obj (1,  LoginCompName , 'user2 = ',user2 );
            }
            else 
            {
                traceLog_msg (1,  LoginCompName , 'Login Fails');
                traceLog (1,  LoginCompName , 'err_msg = ', err_msg );
                alert ('Login fails : \n' + err_msg);
            } 

            navigate("/"); 
        }   // end of else : form fields are filled 

        traceLog_msg (1,  LoginCompName , 'end');
        traceLog_line ();    
    } // end of on submit callback 
       
    /* ------------------------ */         
    const resetError = () => {
        let  LoginCompName = 'Login.js/resetError()';  
        traceLog_msg (1,  LoginCompName , 'setError ()');
        setError("")
    }
    /* ------------------------ */   
   

    /* ------------------------ */   
    traceLog_msg (1,  LoginCompName , 'return');
    return (
    <div>
        <Header  state={2} user={getLocalStorageUser()}/>
        <div class='connect_body'>
        <h2 class='connect_title'>Connect to our Community</h2>
        <p class='connect_text'>Just Provide your Credentials: </p>
        <div class='connect_form_container'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <></>
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
            <button class='connect_button'>Login</button>
        </form>
        </div>
        </div>
    </div>
  
    );  
}  // end of Login function
/* ------------------------------------------------- */

traceLog_msg (1,  LoginCompName , 'end');
export default Login;
