const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    console.log ("auth.js : aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
  
    console.log ("auth.js : authorization :  decodedToken " + decodedToken);
    console.log ("auth.js :authorization :  userId " + userId);
   //  console.log ("authorization :  req" , req);
    console.log ("auth.js :authorization :  req.body " , req.body);
    console.log ("auth.js :authorization :  req.body.userId " + req.body.userId);

    if (req.body.userId !== userId )
    {
      console.log ("auth.js :bbbbbbbbbbbbbbbbbbbbbbb");
    }

    if (req.body.userId && req.body.userId !== userId) {
      console.log ("aaaaaa");
      throw 'Invalid user ID';
    } else {
      console.log ("auth.js : UTILISATEUR ENREGISTRE");
      next();
    }
  } catch {
    console.log ("auth.js :  XXXXXXXXXXXXXXXXXXX");
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
console.log ("auth.js fin ");


/*
module.exports = (req, res, next) => {
  try {
  
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const token_userId = decodedToken.userId;
    const req_body_userid = req.body.userid;

    console.log ("auth.js : authorization :  decodedToken " + decodedToken);
    console.log ("auth.js :authorization :  token userId " + token_userId);
    console.log ("auth.js :authorization :  req.body.userid " + req_body_userid);

    if ((req_body_userid == null)  || (token_userId  == null  ))
    {
      throw 'Invalid user ID (userid not provided)';
    }

    if (req_body_userid !== token_userId) {
   
      throw 'Invalid user ID (userid not valid)';
    } else {
      console.log ("auth.js : UTILISATEUR ENREGISTRE");
      next();
    }
  } catch (error) {
    console.log ("auth.js : Error = ", error );
    res.status(401).json({
      error: new Error('Auth : Invalid request!')
    });
  }
};

*/



