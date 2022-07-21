
import { Link } from 'react-router-dom'
import Header from "../components/Header";
import communicate from '../icons/communicate.jpg'
/* ------------------------------------------------- */


function Logout (){

    localStorage.clear();
 
return (
<div>
     
    <Header  state={0}/>
    <div class='connect_body'>
         <h2 class='connect_title'> Bye ... Let's Communicate Again</h2> 
         <p class='connect_text'> Thanks for your particpation!  </p>
         <img  className='home_communicate_image' src={communicate} alt="logo Groupomania"/>
    </div>
 
</div>  
);    


}

export default Logout;    