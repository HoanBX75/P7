const User = require ('../models/User');
const bcrypt =  require ('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const trace=require ('../utils/TraceLogB');
const  scriptUsername = 'controllers/user.js : ';

/*
  This file is a set of middlewares handling User  requests.
*/


/* 
 -----------------------------------------------------------------------  
1. USER SIGN UP   : signup()
-------------------------------------------------------------------------
API : POST /api/auth/signup
-------------------------------------------------------------------------
Input : req.body.email, req.body.password
{ email: string,password: string }

Description : 
This function creates  a user by 
    hashing the input  password / this hashing will be used to compare the login password
    Check if the user is in the adminList to determine whether it is an admin user
    creating the user in  mongodb with  the hashed password and the email 
  
The response :  { message: String }
*/

exports.signup = (req, res, next) => {
    const funcName =  scriptUsername + ' - signup() : ';
    trace.Log_line();
    trace.Log_msg (1, funcName, 'BEGIN');


    // Hash the password 
    // -----------------
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      
      trace.Log_obj(1,funcName,'hashing = ', hash);
      let  username = req.body.username 
      let usertype = 'user';

      //  the user is an  user type  (admin user is created at start of the backend server ) 
      // ---------------------------
  
      usertype = 'user';

      trace.Log (1,funcName, "username =  ", username);
      trace.Log (1,funcName,  "usertype =  ", usertype);

    // Build the Model User object
      // -----------------------------       
      const user = new User({
          email: req.body.email,
          username: username,
          usertype: usertype,
          password: hash
        });

        trace.Log_obj(1,funcName ,  "signup user =  ", user);

      // Create a user in mongodb
      // ------------------------- 
      user.save()
        .then(() =>
        { 
          trace.Log_msg (1,funcName ,  "signup OK    ");
            res.status(201).json({ message: 'User created !' })
        })
        .catch(error => {
          trace.Log_obj(1,funcName ,  "signup ERROR  : ", error );
          res.status(500).json({ error })
        });
      })
    .catch(error => { 
      trace.Log_obj(1,funcName ,  " signup ERROR  : ", error );
      res.status(500).json({ error })
    });
};


/*  
-----------------------------------------------------------------------  
2. USER SIGN IN  : login()
---------------------------------------------------------------------------
API : POST /api/auth/signup
-------------------------------------------------------------------------
Input : req.body.password, req.body.email
{ email: string,password: string }

Description : 
This function is in charge of the user signs in.
  - it checks if the user already exists in DB 
  - Compare  the provided password with the hashed  password in db 
  - if it is equal, 
      then a  token is generated  using the user id .

The response :  { message: String }
*/

exports.login = (req, res, next) => {
    const funcName =  scriptUsername + ' - login() : ';
    trace.Log_line();
    trace.Log_msg (1, funcName , 'BEGIN '  );
    trace.Log_obj(1,funcName , 'email =  ', req.body.email  );


    // Check that  user exists in DB  by using the email 
    // ---------------------------------------------------

    User.findOne({ email: req.body.email })
    .then(user => {

          if (!user) {
            trace.Log_obj(1,funcName , 'email Not found ', req.body.email  );
            return res.status(401).json({ error: 'User not found !' });
          }

          trace.Log_obj(1,funcName , 'email  found ', req.body.email  ); 

        //  Check password by comparing hashed password  stored in db
        // ---------------------------------------------------------

          bcrypt.compare(req.body.password, user.password)
          .then(valid => {
              if (!valid) {
                trace.Log_obj(1,funcName , 'Wrong password  req.body.password', req.body.password ); 
              return res.status(401).json({ error: 'Wrong password !' });
              }
              
            // Generate Token and send it in the response 
            // --------------------------------------------

            let  secret_token =  process.env.SECRET_TOKEN;   // 'RANDOM_TOKEN_SECRET'
            let s_token = jwt.sign(
                { userId: user._id },
                   secret_token,
                  { expiresIn: '24h' });

                  trace.Log_obj(1,funcName , 'user id '  , user._id  );             
                  trace.Log_obj(1,funcName , 'the token'  , s_token  ); 
                  trace.Log_msg (1,funcName , 'Sign in OK '  ); 

            // Send the response with the token and user id 
            // --------------------------------------------
              res.status(200).json({
                    username: user.username,
                    usertype: user.usertype,
                    userid: user._id,
                    token: s_token
          });

          })
          .catch(error => { 
            trace.Log_obj(1,funcName , ' Error Sign in ', error   ); 
            res.status(500).json({ error })
        });
    })
    .catch(error => {  
      trace.Log_obj(1,funcName , ' Error Sign in ', error   ); 
      res.status(500).json({ error })
  });

  };
      
  trace.Log_msg (1,scriptUsername , 'loaded  '  );
