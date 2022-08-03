

/*
 To enbale the trace, set trace_level to 5 
 To disable the trace, set trace_level to 0  
*/
const trace_level = 0; 

const   traceLog_line =  () =>{
if (trace_level > 0 )
    console.log ('========================================= >' );
}


const   traceLog_msg =  (level, component, msg ) =>{
    if (trace_level > level )
        console.log ('=> ' +  component + ' : '  + msg );
}

const   traceLog_obj =  (level,  component,  text, obj) =>{
    if (trace_level > level )
            console.log ('=> ' +  component +  ' : ' + text  ,  obj );
}

 const   traceLog =  (level, component, text, param) =>{
    if (trace_level > level )
             console.log ('=> ' +  component + ' - '  + ' : ' + text + ' ' +  param );
}

// export default traceLog;
export {traceLog_obj, traceLog, traceLog_msg, traceLog_line};