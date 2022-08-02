import { useState } from "react";
import Header from "../components/Header";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'
import {getLocalStorageUser} from '../utils/UserLocalStorage'


const LoginCompName = 'Login.js';


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Login()
 Description : 
  This function takes an email, a password from a Form, and 
  sends (HTTP Post) them to the back end to connect. 

  The processing is the following:
      - a form is displayed requesting  an email and password  
      - when clicking on the submit button 
          - checking is done against the input parameters 
          - a post http request is sent with email and password 
          as parameter

  If the  http request is succesffull, the login is succesfull
  for the backend; 
  In this case, the user token will be stored in the LocalStorage 
  with some user data.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
*/

function Login (){
    let  LoginCompName = 'Login.js/Login()';    
    traceLog_line ();
    traceLog_msg (1,  LoginCompName , 'begin');
   
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState()
    const navigate = useNavigate()
  

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'onSubmit()' function 
 This function is invoking when clicking on the submit 
 button (Login) from the Form.
 The processing is : 
    - send a http request to login against a user,password
    - if ok 
        then  store user data (token)  in the LocalStorage.
              go to the home page 
        else  An alert message is displayed      
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

    const onSubmit = async (data) => {

        let  LoginCompName = 'Login.js/onSubmit()';    
        traceLog_obj (1,  LoginCompName , 'Input Form data ', data );


        /* Check the input parameters password, email   */
        /* -------------------------------------------- */

        if (data.password === "" || data.email === "") {
            traceLog_msg (1,  LoginCompName , 'Input Form Fields are not all filled!');
            let msg = null;
           if (data.email === "") msg = "Please, fill the Email field!";
           if (data.password === "") {
                 if (msg == null ) msg = "Please, fill the Password field!";
                 else msg = "Please, fill the Email and Password fields!";
           }
           setError(msg);
        }
        else {

            // Double Check the email format 


            // An http post to authenticate, in return get userid and token 
            // ---------------------------------------------------------------

            const userLogin = { email: data.email, password: data.password};

            const request = { method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(userLogin)};          
            let api_url = "http://localhost:3000/api/auth/login";

            let resp_ok = false;
            let user = {userid : '', username : '',   usertype : '',   token : '' };
            let err_msg = '';
            

            traceLog (1,  LoginCompName , 'send  HTTP post url =', api_url )
       
            
            /* Send the Post Request */
            /* ----------------------*/
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

                    /* Getting  the Response data */
                    /* -------------------------- */

                    user.token = data.token;
                    user.userid = data.userid;  
                    user.username=  data.username;  
                    user.usertype = data.usertype;
                }
                else  {
                    err_msg =  err_msg + data.error;
                }
            })
            .catch(err => {
                traceLog_obj (1,  LoginCompName , 'HTTP post Error =', err );
                err_msg =  err_msg + err;
            });

            /* Epilog  */
            /* ------- */   
            if (resp_ok) {
                traceLog_msg (1,  LoginCompName , 'Login Succesfull');
                traceLog_obj (1,  LoginCompName , 'user = ', user );

                /* Registering the user data (in particular the token) in the LocalStorage */
                /* ----------------------------------------------------------------------- */
                localStorage.setItem( 'user' , JSON.stringify(user));
                /* Go to the HOME page */
                /* -------------------- */

                navigate("/");                 
            }
            else 
            {
                // An error has occurred when sending the htpp post 
                traceLog_msg (1,  LoginCompName , 'Login Fails');
                traceLog (1,  LoginCompName , 'err_msg = ', err_msg );
                document.getElementById('form_signin').reset();
                alert ('Login fails : \n' + err_msg);
            } 


        }   // end of else : form fields are filled 



        traceLog_msg (1,  LoginCompName , 'end');
        traceLog_line ();    
    } // end of on submit callback 
       
/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function :  'resetError()' function 
 This function is invoked for resetting 
 the error displayed.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 */

const resetError = () => {
        let  LoginCompName = 'Login.js/resetError()';  
        traceLog_msg (1,  LoginCompName , 'setError ()');
        setError("")
}


 /* 
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
   The Login  component displays 
    + a Header 
    + a Title : Connect to our Community
    + a Text : Just Provide your Credential:
    + a Form consisting of 
       - an input Email
       - an input Password 
        - an error message (if an error occurs)       
       - a submit button
*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

    traceLog_msg (1,  LoginCompName , 'return');
    return (
    <div className='page_main'>
        <Header  state={2} user={getLocalStorageUser()}/>
        <div className='connect_body'>
        <h2 className='connect_title'>Connect to our Community</h2>
        <p className='connect_text'>Just Provide your Credentials: </p>
        <div className='connect_form_container'>
        <form id='form_signin' onSubmit={handleSubmit(onSubmit)}>
           

            <div  className='upd_form_element'>
                <div className='upd_label'>
                <label htmlFor="email">* Email</label>
                </div>
                <input {...register('email')} type="email"  id="email"  onChange={resetError}/>
            </div>

            <div  className='upd_form_element'>
                <div className='upd_label'>
                <label htmlFor="password">* Password</label>
                </div>
                <input type="password"  {...register('password')} id="password" 
                onChange={resetError}/>
            </div>
            {error ?
                        <><div className='connect_form_error'>{error}</div><br></br></> : null}  
            <button className='connect_button'>✔ Log In</button>
        </form>
        </div>
        </div>
    </div>
  
    );  
}  // end of Login function
/* ------------------------------------------------- */

traceLog_msg (1,  LoginCompName , 'loaded');
export default Login;
