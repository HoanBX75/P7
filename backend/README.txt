
Pour lancer le backend : 

1/ Ajouter un dossier "images" au dossier backend.
2/ Renommer le .env_template en .env et remplisser clefs avec vos valeurs : 
    MY_CONNECT : la 'string' de connection à la base mongodb 
    SECRET_TOKEN= la 'string' servant à signer et verifier le token
    ADMIN_USERNAME=<user name de l'administrateur>
    ADMIN_EMAIL=<user email de l'administrateur>
    ADMIN_PASSWORD=<user password de l'administrateur >

 Au démarrage du serveur backend - s'il n'existe pas un utilisateur 
administrateur, il sera créé avec les valeurs des propriétés ADMIN_USERNAME, ADMIN_EMAIL, 
ADMIN_PASSWORD.

3/ Lancer le backend avec la commande : 
   nodemon server
