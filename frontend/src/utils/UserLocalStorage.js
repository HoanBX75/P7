

import {traceLog,traceLog_line, traceLog_obj, traceLog_msg} from '../utils/TraceLog'

function getLocalStorageUser()
{
  let funcName = 'UserLocalStorage.js/getLocalStorageUser()';
  let s_user = localStorage.getItem("user");
 
  let l_user = null;
  if (s_user){
    l_user = JSON.parse(s_user);
  }
  // traceLog_obj (1,   funcName , 'l_user', l_user);

  return (l_user);
}

// export default traceLog;
export {getLocalStorageUser};