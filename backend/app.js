const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes= require('./routes/post');
const User = require('./models/User');
const trace=require ('./utils/TraceLogB');
const bcrypt =  require ('bcrypt');


async function  createAdminUser (i_username, i_password, i_email) 
{
  const funcName =  'app.js/createAdminUser()'; 
  trace.Log_line();
  trace.Log_msg (1,funcName , 'BEGIN '  );
   
  /* Check that the userId is related to an existing user */
  /* A Find Request is done against MongoDb user collection */
 //  await  User.findOne({username: i_username})
 //  await  User.findOne({username: 'i_username'})

 let found = true;

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
        found = false;
        trace.Log_msg (1,funcName , 'The user not found - error = ', error);
     });

  

  if (found) {
    console.log (`Warning :  At server start, no admin user is created with name '${i_username}' or email '${i_email}  (user name/email is already used).`);
    return;
  } 

  // Creating the user 
  // ------------------

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
          trace.Log_msg (1,funcName ,  "Signup Admin OK    ");
          console.log (`The Admin user '{i_username}' with '{i_email}'  has been created.`);
           // res.status(201).json({ message: 'User created !' })
        })
        .catch(error => {

          trace.Log_obj(1,funcName ,  "Signup Admin Fails -  ERROR message = ", error.message );
          console.log (`Warning :  At server start, no admin user is created with name '${i_username}' or email '${i_email}.`);
        });

  })
  .catch(error => { 
    trace.Log_obj(1,funcName ,  " signup ERROR  : " +  error );
    res.status(500).json({ error })
  });  

}


function manageAdminUser (i_username, i_password, i_email, i_action)
{

  const funcName =  'app.js/manageAdminUser()'; 
  trace.Log_line();
  trace.Log_msg (1,funcName , 'BEGIN '  );
  trace.Log_obj(1,funcName  , "admin_username=",i_username );
  trace.Log_obj(1,funcName  , "admin_password=",i_password );
  trace.Log_obj(1,funcName  , "admin_email=",i_email );
  trace.Log_obj(1,funcName  , "admin_action=",i_action );

  if (i_action) 
  {
     trace.Log_msg(1,funcName  ,'action');
      switch (i_action)
      {
        case 'create':
          trace.Log_msg(1,funcName  ,'create');
          createAdminUser (i_username, i_password, i_email)
          break;
        case 'update': 
        trace.Log_msg(1,funcName  ,'update');
          break;
        default:
          trace.Log_msg(1,funcName  ,'default');
          break;
      }
  }
}


// Getting environment parameters 
// -------------------------------
const dotenv = require("dotenv");
dotenv.config();
const MY_CONNECT =  process.env.MY_CONNECT;
const admin_username =  process.env.ADMIN_USERNAME
const admin_email =  process.env.ADMIN_EMAIL
const admin_password =  process.env.ADMIN_PASSWORD
const admin_action =  process.env.ADMIN_ACTION

// Connect to mongodb 
//--------------------

mongoose.connect(MY_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  
// Create the express 
const app = express();

// Check if there is an admin 



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

// Manage  Admin user 
// ------------------ 
manageAdminUser (admin_username,admin_password,admin_email, admin_action);



module.exports = app;
