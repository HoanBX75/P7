import { useParams, useLocation } from "react-router-dom"
import { Link, useNavigate } from 'react-router-dom'
import Header from "../components/Header";

function UpdatePost (){
    const navigate = useNavigate()
    const params = useParams()
    let post_id = params.id;
    console.log ( "UpdatePost params.id " + params.id);
 
return (
<div>
     
    <Header state={5}/>
   <br/>
   postid = {post_id}
   ......
</div>  
);    


}

export default  UpdatePost 