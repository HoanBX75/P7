
import { Link } from 'react-router-dom'
import  "../styles/index.css"
import logo from '../icons/icon-left-font.png'


function Header (props){

    let state = props.state;
    let user =  props.user;
    
    function getCurrentUser(){
      if (user.usertype === 'admin') 
      return (<p><strong>Admin User : {user.username}</strong></p>);
      else 
      return (<p><strong>User: {user.username}</strong></p>);
    }

    switch (state)
    {
      case 0:   /* SIGN UP	LOGIN */
      return (
         <div>
          <nav class='header_connect_container'>
             <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
             <Link className='header_main_link' to="/">Home</Link> 
            <Link  className='header_link' to="/signup">SIGN UP</Link> 
            <Link  className='header_link' to="/login">LOGIN</Link>
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
                <Link className='header_main_link' to="/signup">SIGN UP </Link> 
                <Link className='header_link' to="/login">LOGIN</Link>
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
              <Link className='header_link' to="/signup">SIGN UP</Link> 
              <Link  className='header_main_link' to="/login">LOGIN</Link>
            </nav>
            <hr/>    
        </div> 
        );   
        break;

      case 3:    /*  ALL POSTS =  x ALL POSTS  	ADD POST  LOGOUT */
      return (
        <div>  
            <nav class='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_main_link' to="/">ALL POSTS</Link> 
                <Link className='header_link'  to="/post/add">ADD POST</Link> 
                <Link className='header_link' to="/logout">LOGOUT</Link>
            </nav>
      
            <hr/>
            {getCurrentUser()}
        </div> 
      );
          break;
      case 4 :    /* ADD POST =    ALL POSTS  x 	ADD POST  LOGOUT */
      return (
        <div>  
            <nav class='header_connect_container'>
                <img  className='header_image_logo' src={logo} alt="logo Groupomania"/>
                <Link className='header_link' to="/">ALL POSTS</Link> 
                <Link className='header_main_link'  to="/post/add">ADD POST</Link> 
                <Link className='header_link' to="/logout">LOGOUT</Link>
            </nav>
           
            <hr/>
            {getCurrentUser()}
        </div> 
          );
          break;
      case 5 :   /*  update .  ALL POSTS  	ADD POST  LOGOUT */
      return (
        <nav>
  
        <Link to="/">ALL POSTS</Link> 
        <br/>
        <Link to="/post/add">ADD POST</Link> 
        <br/>
        <Link to="/logout">LOGOUT</Link>
        {getCurrentUser()}
        <hr/>
      
        </nav>
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
