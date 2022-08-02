import Header from "../components/Header";
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'

const SignupCompName = 'Signup.js';

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Signup()
 Description : 
  This function takes an email, a username, a password from a Form, and 
  sends (HTTP Post) them to the back end to register. 

  The processing is the following:
      - a form is displayed requesting  an email, a username and password  
      - when clicking on the submit button (Sign up)
          - checking is done against the input parameters 
          - a post http request (post ) is sent with username email and password 
          as parameter
          - if http is not succesfull, then alert will be displayed 
          - else go to the Home page

  When http request is succesffull, the user is registered in the backend;
 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
*/

function Signup (){


    let  SignupCompName = 'Signup.js/Signup()';  
    traceLog_line ();
    traceLog_msg (1,  SignupCompName , 'begin');

    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()
    const navigate = useNavigate()

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'onSubmit()' function 
 This function is invoking when clicking on the submit 
 button (Sign up) from the Form.
 The processing is : 
    - send a http request to login against a user,password
    - if ok 
        then  store user data (token)  in the LocalStorage.
     else an alert message is displayed   
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
    
    const onSubmit = async (data) => {
        let  SignupCompName = 'Login.js/onSubmit()';  
        traceLog_obj (1,  SignupCompName , 'Input Form data ', data );

        /* Check the input parameters password, email, username    */
        /* ------------------------------------------------------- */

        if (data.password === "" || data.email === "" || data.username === "" ) {
            traceLog_msg (1,  SignupCompName , 'Input Form Fields are not all filled!');
            let msg = "(";
      
            if (data.password === "") {msg += 'Password '} 
            if (data.email === "") {msg += 'Email ';        }  
            if (data.username === "") {msg += 'Username ' } 
            msg += ')!'  
            setError('Please, Fill all the fields ' + msg )
        }
        else {
            let resp_ok = false;
            let token = null;
            let userid = null;
            let username = null;
            let usertype = null;
            let err_msg = '';

            /* Prepare the signup http request Input data  */
             /* ------------------------------------------ */

            const userSignup = { username: data.username, email: data.email, password: data.password};
            const request = { method: 'POST',headers: { 'Content-Type': 'application/json' },
                                                         body: JSON.stringify(userSignup)};   

            let api_url = "http://localhost:3000/api/auth/signup";
           
            traceLog (1,  SignupCompName , 'send  HTTP post signup  url =', api_url );

             /* Send the Post Request */
            /* ----------------------*/
            await fetch(api_url, request)
            .then(response => {
                traceLog_obj (1,  SignupCompName , 'HTTP post signup response =', response );
                if (response.ok) {
                    resp_ok = true;
                }   
                return (response.json());
            })
            .then(data  => {

                traceLog_obj (1,  SignupCompName , 'HTTP post  signup response body =', data );
                if (resp_ok) {
                    /* Getting  the Response data */
                    /* -------------------------- */

                    /* Response data = {message: " "} */
                    traceLog_obj (1,  SignupCompName , 'HTTP post signup OK  data  =', data  );
                }
                else 
                {
                    /*  Response data = {error : {message:  " .... "}} */

                    traceLog_obj (1,  SignupCompName , 'HTTP post signup NOK  data  =', data  );
                    err_msg =  err_msg + data.error.message;
                }
            })
            .catch(err => {
                traceLog_obj (1,  SignupCompName , 'HTTP post Error =', err );
                err_msg =  err_msg + err;
            });
        
            /* Epilog  */
            /* ------- */

            if (resp_ok) {
                traceLog_msg (1,  SignupCompName , 'Signup Succesfull'); 
                /* Go to the HOME page */
                /* -------------------- */
                navigate("/"); 
            }
            else 
            {
                traceLog_msg (1,  SignupCompName , 'Signup  Failed');
                traceLog_obj (1,  SignupCompName , 'err_msg = ', err_msg );
                document.getElementById('form_signup').reset();

                alert ('Signup fails : \n' + err_msg);
            } 


        }
        traceLog_msg (1,  SignupCompName , 'end');
        traceLog_line ();          
    }
   
/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'resetError()' function 
 This function is invoked for resetting 
 the error displayed.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */
 
    const resetError = () => {
        let  LoginCompName = 'Signup.js/resetError()';  
        traceLog_msg (1,  SignupCompName , 'setError ()');
        setError("")
    }
  
 /* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The Login  component displays 
    + a Header 
    + a Title : Join our Community
    + a Text : Just Provide your Credential:
    + a Form consisting of 
       - an input Email
       - an user name
       - an input Password 
        - an error message (if an error occurs)       
       - a submit button
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

    return (
    <div className='page_main'>
        <Header  state={1} user={getLocalStorageUser()}/>

        <div className='connect_body'>
            <h2 className='connect_title'>Join our   Community </h2>
            <p className='connect_text'>Just Fill all the Fields  : </p> 
            <div className='connect_form_container'>
            <form id='form_signup' onSubmit={handleSubmit(onSubmit)}>
                <div className='upd_form_element'>
                    <div className='upd_label'>
                    </div>
                    <label htmlFor="email">* Email</label>
                    <input {...register('email')} type="email" onChange={resetError} id="email" />
                </div>
                <div className='upd_form_element'>
                    <div className='upd_label'>
                    <label htmlFor="username">* Username</label>
                    </div>
                    <input {...register('username')} type="text" onChange={resetError} id="username" />
                </div>
                <div className='upd_form_element'>
                   <div className='upd_label'>
                    <label htmlFor="password">* Password</label>
                    </div>
                    <input type="password" {...register('password')}   onChange={resetError} id="password" />
                </div>
                {error ?
                    <><div className='connect_form_error'>{error}</div><br></br></> : null}
                <button className='connect_button'>✔ Sign up</button>
            </form>
            </div>
        </div>
    </div>
    );   
}
traceLog_msg (1,  SignupCompName , 'loaded');
export default Signup;
