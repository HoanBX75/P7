const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const trace=require ('../utils/TraceLogB');

const  scriptAuthName = 'controllers/auth.js';
/*
Description : 
  This file is a  middleware that takes  the token provided in request 
  and check it against the user issuing the request.
  A request to the DB to check if the userId is related 
  to a user in the db .
  If it is fine, the userId, userName is added to the req .
*/


module.exports = (req, res, next) => {
  try {
    /* Get the token from the header */
    /* ----------------------------- */

    const token = req.headers.authorization.split(' ')[1];
    trace.Log_line();
    trace.Log_msg (1,scriptAuthName ,'BEGIN ');

    /* Get the the userId */
    /* ------------------- */
    let  secret_token =  process.env.SECRET_TOKEN;   
    // 'RANDOM_TOKEN_SECRET' is obtained from the .env with the SECRET_TOKEN KEY 

    const decodedToken = jwt.verify(token, secret_token);
    const userId = decodedToken.userId;
    trace.Log_obj(1,scriptAuthName , 'token userId  = ',  userId);

    if (req.body.userId && req.body.userId !== userId) {
      trace.Log_obj(1,scriptAuthName , 'Authorization NOK invalid user', req.body.userId)
      throw 'Invalid user ID';
    } else {
    
      trace.Log_obj(1,scriptAuthName , 'Checking In DB the userId =', userId );
    
      /* Check that the userId is related to an existing user */
      /* A Find Request is done against MongoDb user collection */
      User.findOne({_id: userId})
      .then((user) =>  {
        trace.Log_obj(1,scriptAuthName , 'The username  = ', user.username);
        trace.Log_msg (1,scriptAuthName , 'Authorization OK');
       /* add   userId, username to the request   as they  will be used  */
      req.username = user.username ; 
      req.userId = userId;   
      req.usertype = user.usertype;                       
      next();
      })
      .catch(error => { 
        trace.Log_msg (1,scriptAuthName , 'Authorization NOK = userId not found ');
        res.status(401).json({
          error: new Error('Invalid request!!')
        });
     });
 
    }
  } catch (err) {
    trace.Log_obj(1,scriptAuthName , 'Authorization NOK err= ' , err);
    trace.Log_obj(1,scriptAuthName , 'Authorization NOK authorization= ' , req.headers.authorization);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};





