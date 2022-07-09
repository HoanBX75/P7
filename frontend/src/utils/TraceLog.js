

const   traceLog_line =  () =>{
console.log ('========================================= >' );
}


const   traceLog_msg =  (level, component, msg ) =>{
console.log ('=> ' +  component + ' : '  + msg );
}

const   traceLog_obj =  (level,  component,  text, obj) =>{
console.log ('=> ' +  component +  ' : ' + text  ,  obj );
}

 const   traceLog =  (level, component, text, param) =>{
 console.log ('=> ' +  component + ' - '  + ' : ' + text + ' ' +  param );
}

// export default traceLog;
export {traceLog_obj, traceLog, traceLog_msg, traceLog_line};