import { useState, useEffect } from "react";
import Header from "../components/Header";
import { postList } from "../datas/postList";
import { Link, useNavigate } from 'react-router-dom'

function Home() {

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const navigate = useNavigate()

   function isConnected ()
   {
      let user = localStorage.getItem("user");
      console.log ("Home - user = " + user );
      if (user) return (true);
      return (false);
   }

   function getHeaderState () 
   {
        if (isConnected() ) {
            return (3);  /* All posts */ 
        }
        return (0);
   }


   function updatePost (id, name)
   {
     console.log ("updatePost ", id);
     navigate (`post/update/${id}`)

     // `/post/edit/${element.id}`

   }

   function likePost (id, name)
{
  console.log ("likePost ", id);
}


function deletePost (id, name)
{
  console.log ("deletePost ", id);
}

function getAllPosts ()
{
   if (isConnected())
   {

      // Get All the posts 
      
      return (
        <ul >
        {postList.map(({ id, name, text  }) => (
            <div key={id}>
                id = {id} - name={name } - text = {text}
                <button onClick={() => deletePost (id, name)}>Delete</button><span>  </span>
                <button onClick={() => updatePost (id, name)}>Update</button><span>  </span>
                <button onClick={() => likePost (id, name)}>Like</button>
            </div>
        ))}
    </ul>
      )

     
   }
   else {
   return <p>   </p>;
   }
}  


    return (
        <div>
            
            <Header  state={getHeaderState()}/>
            {getAllPosts()}
        </div>
    );    
}   



export default Home;
