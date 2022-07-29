
import Header from "../components/Header";


/*
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*- 
 Function : DefaultPage()
 Description : 
  This function  displays a No Page found  message as the Url provided 
  is wrong.
  It  displays :
     - a header
     - a message

 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-     
*/

function DefaultPage() {

    return (
        <div>
        <Header  state={404} />
        <div className="center_msg"><p>No Page Found here!</p></div>
        <hr/>
    
        </div>
    )   

}

export default DefaultPage
