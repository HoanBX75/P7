
const trace_level = 0; /* 0 disable the trace , 5 enable the trace*/

exports.Log_msg = (level, component, msg) => {
    if (trace_level > level )
    console.log ('=> ' +  component + ' : '  + msg );
}

exports.Log_line =  () =>{
    if (trace_level > 0 )
        console.log ('========================================= >' );
    }
    
exports.Log_obj =  (level,  component,  text, obj) =>{
        if (trace_level > level )
                console.log ('=> ' +  component +  ' : ' + text  ,  obj );
    }
    
exports.Log =  (level, component, text, param) =>{
        if (trace_level > level )
                 console.log ('=> ' +  component + ' - '  + ' : ' + text + ' ' +  param );
}


/*
const trace=require ('../utils/TraceLogB');

trace.Log_msg (1, ,'');
trace.Log_line();
trace.Log_obj(1,,' ', );
trace.Log(1,'zzzz','voici l objet ', 2);
*/