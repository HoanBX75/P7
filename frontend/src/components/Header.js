
import { Link } from 'react-router-dom'
import  "../styles/index.css"
import logo from '../icons/icon-left-font.png'


function Header (props){

    let state = props.state;
    let user =  props.user;
    
    function getCurrentUser(){
      let admin=null
      if (user.usertype === 'admin') admin ='*';
         
      /*
      if (user.usertype === 'admin') 
      return (<p>User*: {user.username}</p>);
      else 
      return (<p>User: {user.username}</p>);
      */
      return (
        <div class='current_user_container'>
          <span class='current_user'> {admin }Logged: </span> 
          <span class='current_username'>{user.username}</span> 
        </div>
      );

    }

    switch (state)
    {
      case 0:   /* SIGN UP	LOGIN */
      return (
         <div>
          <nav class='header_connect_container'>
             <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
             <Link className='header_main_link' to="/">Home</Link> 
            <Link  className='header_link' to="/signup">Sign Up </Link> 
            <Link  className='header_link' to="/login">Login</Link>
          </nav>
          <hr/>    
          </div> 
       );   

          break;
      case 1:   /* SIGNUP  =   HOME x SIGN UP	LOGIN  */ 
      return (
        <div>
          <nav class='header_connect_container'> 
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/">Home</Link>  
                <Link className='header_main_link' to="/signup">Sign Up </Link> 
                <Link className='header_link' to="/login">Login</Link>
          </nav>    
          <hr/>    
        </div>      
        );   

      case 2:    /*  LOGIN = HOME SIGN UP	x LOGIN  */  

      return (
        <div>  
            <nav class='header_connect_container'>
              <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
              <Link className='header_link' to="/">Home</Link> 
              <Link className='header_link' to="/signup">Sign Up</Link> 
              <Link  className='header_main_link' to="/login">Login</Link>
            </nav>
            <hr/>    
        </div> 
        );   
        break;

      case 3:    /*  ALL POSTS =  x ALL POSTS  	ADD POST  LOGOUT */
      return (
        <div>  
                {getCurrentUser()}
            <nav class='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_main_link' to="/"> Posts</Link> 
                <Link className='header_link'  to="/post/add">New Post</Link> 
                <Link className='header_link' to="/logout">Logout</Link>
            </nav>
      
            <hr/>
           
        </div> 
      );
          break;
      case 4 :    /* NEW POST =    ALL POSTS  x 	ADD POST  LOGOUT */
      return (
        <div>  
            {getCurrentUser()}
            <nav class='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/"> Posts</Link> 
                <Link className='header_main_link'  to="/post/add">New Post</Link> 
                <Link className='header_link' to="/logout">Logout</Link>
                
            </nav>
            <hr/>
           
        </div> 
          );
          break;
      case 5 :   /*  UPDATE POST =  ALL POSTS  	ADD POST  LOGOUT */
      return (
        <div>  
            {getCurrentUser()}
            <nav class='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/"> Posts</Link> 
 
                <Link className='header_link' to="/logout">Logout</Link>
                
            </nav>
            <hr/>
           
        </div>
      );

          break; 
      default : 
         break;
    }

    return (
        <nav>
        <p> Header : state = {state }</p>
        <Link to="/signup">SIGN UP</Link> 
        <br/>
        <Link to="/login">LOGIN</Link>
        <hr/>
     
        </nav>
        
        
    );   
}

export default Header;
