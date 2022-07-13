
import { Link } from 'react-router-dom'


function Header (props){

    let state = props.state;
    let user =  props.user;
    
    function getCurrentUser(){
      return (<p><strong>USER : {user.username}</strong></p>);
    }

    switch (state)
    {
      case 0:   /* SIGN UP	LOGIN */
      return (
        <nav>
   
        <Link to="/signup">SIGN UP</Link> 
        <br/>
        <Link to="/login">LOGIN</Link>
        <hr/>
       
        </nav>
       );   

          break;
      case 1:   /* x SIGN UP	LOGIN  */ 
      
      return (
        <nav>
        
        <Link to="/">Home</Link> 
        <br/>
         <Link to="/signup"><strong>SIGN UP</strong></Link> 
        <br/>
        <Link to="/login">LOGIN</Link>
        <hr/>
     
        </nav>
        
        
    );   


          break;
      case 2:    /*  SIGN UP	x LOGIN  */  

      return (
        <nav>
      
        <Link to="/">Home</Link> 
        <br/>
        <Link to="/signup">SIGN UP</Link> 
        <br/>
        <Link to="/login"><strong>LOGIN</strong></Link>
        <hr/>
    
        </nav>
       
        
    );   
          break;
      case 3:    /*  x ALL POSTS  	ADD POST  LOGOUT */
      return (

      <nav>
 
      <Link to="/"><strong>ALL POSTS</strong></Link> 
      <br/>
      <Link to="/post/add">ADD POST</Link> 
      <br/>
      <Link to="/logout">LOGOUT</Link>
      {getCurrentUser()}
      <hr/>
   
      </nav>
      );
          break;
      case 4 :    /* add   ALL POSTS  x 	ADD POST  LOGOUT */
      return (
        <nav>
  
        <Link to="/">ALL POSTS</Link> 
        <br/>
        <Link to="/post/add"><strong>ADD POST</strong ></Link> 
        <br/>
        <Link to="/logout">LOGOUT</Link>
        {getCurrentUser()}
        <hr/>
     
        </nav>
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
