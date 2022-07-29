
import { Link } from 'react-router-dom'
import  "../styles/index.css"
import logo from '../icons/icon-left-font.png'

/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : Header()
 Description : 
  This function is in charge of displaying the header 
  of the different pages.
  The header takes two parameters : 
    - user    : the usertype , and username are used to display 
                the name and type (admin) of the user connected.
    - state   : the state is indicating which header to display 
                according to the page.
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
*/

function Header (props){

    let state = props.state;
    let user =  props.user;
    

    function getCurrentUser(){
      let admin=null
      if (user.usertype === 'admin') admin ='*';
         
      return (
        <div className='current_user_container'>
          <span className='current_user'> {admin }Logged: </span> 
          <span className='current_username'>{user.username}</span> 
        </div>
      );

    }

/* 
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 RETURN 
 if state equals to 
   0 :  Logout Page or Home page when user not connected
   1:   Signup page  Header page 
   2:   Login 
   3:   Home  
   4:   New Post page 
   5:   Update page 

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
*/

    switch (state)
    {
      case 0:   /* LOGOUT + Home (not connected ) = SIGN UP	LOGIN */
      return (
         <div>
          <nav className='header_connect_container'>
             <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
             <Link className='header_main_link' to="/">Home</Link> 
            <Link  className='header_link' to="/signup">Sign Up </Link> 
            <Link  className='header_link' to="/login">Login</Link>
          </nav>
          <hr/>    
          </div> 
       );   

      case 1:   /* SIGNUP  =   HOME x SIGN UP	LOGIN  */ 
      return (
        <div>
          <nav className='header_connect_container'> 
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
            <nav className='header_connect_container'>
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
            <nav className='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_main_link' to="/"> Posts</Link> 
                <Link className='header_link'  to="/post/add">New Post</Link> 
                <Link className='header_link' to="/logout">Logout</Link>
            </nav>
      
            <hr/>
           
        </div> 
      );
        
      case 4 :    /* NEW POST =    ALL POSTS  x 	ADD POST  LOGOUT */
      return (
        <div>  
            {getCurrentUser()}
            <nav className='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/"> Posts</Link> 
                <Link className='header_main_link'  to="/post/add">New Post</Link> 
                <Link className='header_link' to="/logout">Logout</Link>
                
            </nav>
            <hr/>
           
        </div> 
          );
         
      case 5 :   /*  UPDATE POST =  ALL POSTS  	ADD POST  LOGOUT */
      return (
        <div>  
            {getCurrentUser()}
            <nav className='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/"> Posts</Link> 
 
                <Link className='header_link' to="/logout">Logout</Link>
                
            </nav>
            <hr/>
           
        </div>
      );

      case 404: 
      return (
        <div>
         <nav className='header_connect_container'>
            <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
            <Link className='header_main_link' to="/">Home</Link> 
         </nav>
         <hr/>    
         </div> 
      );   
       
      default : 
         break;
    }
    // Unexpected header 
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
