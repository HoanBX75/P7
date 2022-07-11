
import { Link } from 'react-router-dom'
import Header from "../components/Header";
/* ------------------------------------------------- */


function Logout (){

    localStorage.clear();
 
return (
<div>
     
    <Header  state={0}/>
  
   <p>Bye! Would you like to connect again ?</p>
 
</div>  
);    


}

export default Logout;    