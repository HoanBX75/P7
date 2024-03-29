const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes= require('./routes/post');
const User = require('./models/User');
const trace=require ('./utils/TraceLogB');
const bcrypt =  require ('bcrypt');


/* ======================================================================================================== */
/*                                          FUNCTIONS                                                       */
/* ======================================================================================================== */

/*
-------------------------------------------------------------------------
Function createAdminUser()
Description : 
   This function is used to create an Admin user at the start of the 
   backend server.
   Input parameters 
   i_username : user name 
   i_password : user password 
   i_email :  user mail

 The processing is the following : 
 1/ check the input parameters 
 2/ Do a find request is the user is already existing (do a findOne in mongoDB) 
 3/ if the user does not exist , create an an Admin user 
    by inserting a user in mongodb 

-------------------------------------------------------------------------
*/

async function  createAdminUser (i_username, i_password, i_email) 
{
  const funcName =  'app.js/createAdminUser()'; 
  trace.Log_line();
  trace.Log_msg (1,funcName , 'BEGIN '  );
   
  /* check username  */
  /* --------------- */
  if ((i_username==null) ||(i_username.length == 0)) {
    console.log ('Warning : User name must be provided in the .env file with ADMIN_USERNAME to \
create an Admin User. Else just remove ADMIN_USERNAME property.');
    return;
  }
  else 
  {
    let regName = /^[ a-zA-Z0-9._\s -]+$/g;
    if(!regName.test(i_username)){
      console.log ('Warning : Bad format User name. Update the user name in the .env file with ADMIN_USERNAME to \
create an Admin User.');
        return;
    }
  }

  /* check password  */
  /* --------------- */
  if ((i_password==null) ||(i_password.length == 0)) {
    console.log ('Warning : User password must be provided in the .env file with ADMIN_PASSWORD \
create an Admin User. Else just remove ADMIN_PASSWORD property. ');
    return;
  }
  else 
  {
    let regName = /^[ a-zA-Z0-9._\s -]+$/g;
    if(!regName.test(i_password)){
      console.log ('Warning : Bad format User password. Update the user password in the .env file with ADMIN_PASSWORD to \
create an Admin User.');
        return;
    }
  }

  /* check email  */
  /* ------------ */
  if ((i_email==null) ||(i_email.length == 0)) {
     console.log ('Warning : User mail  must be provided in the .env file with ADMIN_EMAIL \
create an Admin User.');
     return;
  }
  else 
  {
    let regEmail = /^[a-zA-Z0-9._\s-]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/g;
    if(!regEmail.test(i_email)){
      console.log ('Warning : Bad format User email. Update the user email  in the .env file with ADMIN_EMAIL to \
create an Admin User. ');
        return;
    }
  }

 
  /* Check that the user defined  by email and username is related to an existing user.  */
  /* ---------------------------------------------------------------------------------- */
  let found = true;
  let b_error =  false;
  await  User.findOne({username: i_username, email:i_email})
  .then((user) =>  {
      
       if (user != null)  {
         found = true;
        trace.Log_obj(1,funcName , 'The user found   = ', user);
       }
       else  {
         found = false;
        trace.Log_msg(1,funcName , 'The user is Not found   ');
       }            
  })
  .catch(error => { 
        found = true;
        trace.Log_msg (1,funcName , 'The user not found - error = ', error);
  });

  /* If the user is found, no user creation */
  /* --------------------------------------- */

  if (found) {
    console.log (`Warning :  At the server start, no admin user is created with name '${i_username}' or \n email '${i_email}' \
(user name/email areused or user already exists).`);
    return;
  } 

  // ---------------------
  // Create an Admin  user 
  // ---------------------

  // Hash the password 
  // ---------------
  bcrypt.hash(i_password, 10)
  .then(hash => {
      const user = new User({
              email: i_email,
              username: i_username,
              usertype: 'admin',
              password: hash});

      trace.Log_obj(1,funcName  , "user=",user );

      // Create a user in mongodb
      // ------------------------- 
      user.save()
        .then(() =>
        { 
          trace.Log_msg (1,funcName ,  "Create Admin User  OK    ");
          console.log (`The Admin user with '${i_username}' name  and '${i_email}' email has been created.`);
        })
        .catch(error => {
          trace.Log_obj(1,funcName ,  "Create Admin User Fails -  error message = ", error.message );
          console.log (`Warning :  At server start, no admin user is created with name '${i_username}' or email '${i_email}.`);
        });

  })
  .catch(error => { 
    trace.Log_obj(1,funcName ,  " Create Admin User is not created - ERROR  : " +  error );
    console.log ("Create Admin User Fails - ERROR  : " +  error );
  });  

}

/*
-------------------------------------------------------------------------
Function manageAdminUser()
Description : 
   This function is used to manage an Admin user at the start of the 
   backend server.
   Here it is invoking createAdminUser() to create an Admin User.
   Input parameters 
   i_username : user name 
   i_password : user password 
   i_email :  user mail
-------------------------------------------------------------------------
*/
function manageAdminUser (i_username, i_password, i_email)
{
  const funcName =  'app.js/manageAdminUser()'; 
  trace.Log_line();
  
  /* ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD  are mandatory  */
  if ((i_username == null) && (i_password == null) &&(i_email == null )) {
    trace.Log_msg(1,funcName  ,'No Admin user management');
    return ;
  }
  trace.Log_obj(1,funcName  , "admin_username=",i_username );
  trace.Log_obj(1,funcName  , "admin_password=",i_password );
  trace.Log_obj(1,funcName  , "admin_email=",i_email );  

  let l_action = "create"; /* other actions can be developed ... */

  if (l_action) 
  {
     trace.Log_msg(1,funcName  ,'action');
      switch (l_action)   /* switch for future actions as update, delete to be developed */
      {
        case 'create':
          trace.Log_msg(1,funcName  ,'create');
          createAdminUser (i_username, i_password, i_email)
          break;
          /*
          case 'update:' ..... break;
          */
        default:
          trace.Log_msg(1,funcName  ,'default');
          break;
      }
  }
}
/* ======================================================================================================== */



// Getting environment parameters 
// -------------------------------
const dotenv = require("dotenv");
dotenv.config();
const MY_CONNECT =  process.env.MY_CONNECT;
const admin_username =  process.env.ADMIN_USERNAME
const admin_email =  process.env.ADMIN_EMAIL
const admin_password =  process.env.ADMIN_PASSWORD


// Connect to mongodb 
//--------------------

mongoose.connect(MY_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  
// Create the express 
const app = express();


// Allow cross origin, methods, and header attributes 
// -------------------------------------------------
 
app.use((req, res, next) => {
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Express Json   

app.use(express.json());

// gestion de requête vers le dossier images/-- chemin d'accès absolu.
app.use('/images', express.static(path.join(__dirname, 'images')));


// Routes 
// ------

app.use('/api/auth/', userRoutes);
app.use('/api/post/', postRoutes);

// Manage  Admin user (creata an admin user if needed)
// ------------------ 
manageAdminUser (admin_username,admin_password,admin_email);



module.exports = app;
