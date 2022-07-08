
import { Link } from 'react-router-dom'
import Header from "../components/Header";
/* ------------------------------------------------- */


function Logout (){

    localStorage.removeItem('user');
    localStorage.removeItem('token');

return (
<div>
     
    <Header  state={0}/>
   <br/>
 
</div>  
);    


}

export default Logout;    