const User = require ('../models/User');
const adminUserList  = require ('../data/adminUserList.js');

const bcrypt =  require ('bcrypt');
const jwt = require('jsonwebtoken');

console.log ("controller : begin");

// ------------------------------------------  
// Sign up 
// ------------------------------------------  


exports.signup = (req, res, next) => {
    console.log ('controllers : signup req = ');
   

    bcrypt.hash(req.body.password, 10)
    .then(hash => {

      console.log ('controllers : signup  hashing  = ',hash);
    
   
  
      let  username = req.body.username 
      let usertype = 'user';
      let found   = adminUserList.find (name => name === username);
      if (found)  usertype = 'admin';

      console.log ('controllers : signup  username  = ',username);
      console.log ('controllers : signup  usertype  = ',usertype);

        const user = new User({
          email: req.body.email,
          username: username,
          usertype: usertype,
          password: hash
        });

        console.log ('controllers : signup user = ',user);

        user.save()
        .then(() =>
        { 
            console.log ("controllers : signup ok");
            res.status(201).json({ message: 'User created !' })
        })
        .catch(error => {
          console.log (" controller signup error ", error );
          res.status(400).json({ error });
        });
    })
    .catch(error => res.status(500).json({ error }));
};

// ------------------------------------------  
// Login 
// ------------------------------------------  
  exports.login = (req, res, next) => {
    console.log ('controllers : login  = email ', req.body.email);


    // Check whether user exists in DB    
    User.findOne({ email: req.body.email })
    .then(user => {

          if (!user) {
            console.log ('controllers : login  = email Not found ', req.body.email);
            return res.status(401).json({ error: 'User not found !' });
          }

          console.log ('controllers : login  = email  found ', req.body.email);
          //  check password by comparing hash         
          bcrypt.compare(req.body.password, user.password)
          .then(valid => {
              if (!valid) {
                console.log ('controllers : login  = email  mot de passe wrong ', req.body.email);
              return res.status(401).json({ error: 'Wrong password !' });
              }
              console.log ('controllers : login  = email  mot de passe good userId ', user._id);
              console.log ('controllers Providing the token  ');

              // Create  Token and send it in the response 
              let s_token = jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' });
              console.log ('controllers  the token ' , s_token );
              console.log ('controllers  user._id ' , user._id );

              res.status(200).json({
                    username: user.username,
                    usertype: user.usertype,
                    userid: user._id,
                    token: s_token
          });


          })
          .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };
      
