
La base de données utilisée est MongoDB Atlas (une base donnée locale 
peut être utilisée).
Aussi, pour ce projet il faut créer une base de donnée dans MongoDB 
et avoir accès à celle-ci.


- Pour le backend : 
-------------------- 

1/ Ajouter un dossier "images" au dossier backend.
2/ Renommer le .env_template en .env et remplisser clefs avec vos valeurs : 
 MY_CONNECT : la 'string' de connection à la base mongodb 
 SECRET_TOKEN= la 'string' servant à signer et verifier le token
3/ Lancer le backend avec la commande : 
   nodemon server

- Pour le frontend :
---------------------

Pour lancer le frontend, taper la command : 
npm start 

Noter que le port d'écoute est 4200 (celui est configurable dans package.json)


