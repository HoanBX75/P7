
import { Link } from 'react-router-dom'
import Header from "../components/Header";
import communicate from '../icons/communicate.jpg'
/* ------------------------------------------------- */


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Logout()
 Description : 
  This function is in charge of clearing out the context 
  of the user connection. 
*/


function Logout (){

/* Check the user */

    localStorage.clear();
 
return (
<div>
     
    <Header  state={0}/>
    <div className='connect_body'>
         <h2 className='connect_title'> Bye ... Let's Communicate Again</h2> 
         <p className='connect_text'> Thanks for your particpation!  </p>
         <img  className='home_communicate_image' src={communicate} alt="logo Groupomania"/>
    </div>
 
</div>  
);    


}

export default Logout;    