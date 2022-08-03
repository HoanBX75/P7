README.txt (projet P7)
----------------------------------------------------------------------------------------
Ce README décrit comment :
  1. configurer et démarrer le frontend et backend serveur du project P7 (Créez un réseau social d’entreprise).
  2. initialiser une base de donnée mongoDB de users, posts à partir d'un dump mongoDB 
      

Il y a 3 répertoires principaux : 
 - backend  : contient le code du backend 
 - frontend : contient le code du frontend
 - test     : contient le dump de la base de donnnée mongoDB  avec des 'posts', des 'users'
           et un Readme.txt qui décrit comment restaurer la base de donnée MongoDB .




------------------------------------------------------------------------------------------------
1. Configuer, Démarrer front et back end, se connecter à l'application 
------------------------------------------------------------------------------------------------


1.1 Configurer le backend  (** un utilisateur admin ***, MongoDB connect string, token string) 
--------------------------------------------------------------------------------------
-  Pré-requis : pour ce projet il faut créer une base de donnée dans MongoDB  Atlas
(une base donnée locale) et avoir accès à celle-ci avec un utilisateur . 

Pour configurer, suivre ces étapes: 

A/  Aller dans le répertoire backend 
B/ Ajouter un dossier "images" au dossier backend.
C/  Renommer le .env_template en .env et remplisser clefs avec vos valeurs : 

  MY_CONNECT=<'string' de connection à la base mongodb>
  SECRET_TOKEN=<'string' servant à signer et vérifier le token de connection>

  ADMIN_USERNAME=<user name de l'administrateur>
  ADMIN_EMAIL=<user email de l'administrateur>
  ADMIN_PASSWORD=<user password de l'administrateur >

 Au démarrage du serveur backend - s'il n'existe pas un utilisateur 
administrateur, il sera créé avec les valeurs des propriétés ADMIN_USERNAME, ADMIN_EMAIL, 
ADMIN_PASSWORD.

Exemple: 
--------
MY_CONNECT=mongodb+srv://george:georgepass@cluster0.kpc66n.mongodb.net/testp7
          -  le nom est george 
          - le password gerogepass 
          - le nom de la base de donnée est testp7

SECRET_TOKEN=RANDOM_TOKEN_SECRET

Et, un user administrateur sera créé dans la collectection user de mongodb 
ave le nom admin, email admin@gmail.com et le mot de passe admin.

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin

1.2 Démarrer le backend 
-----------------------

 - aller dans le répertoire backend , et  taper  la commande : 
   nodemon server


1.3  Démarrer le frontend 
-----------------------

 - aller dans le répertoire frontend ,  taper la commande : 
npm start 

Noter que le port d'écoute est 4200 (celui est configurable dans package.json)


1.4 Invoker l'application 
-------------------------
  Dans un browser, aller à http://localhost:4200


------------------------------------------------------------------------------------------------
2. Initializer la base de données (MongoDB ) de l'application avec un dump d'une base prédéfinie.
------------------------------------------------------------------------------------------------

Dans le répertoire test se trouvent :  
 - un dump d'une base de données contenant des posts et users 
 - les images correspondants  aux images des posts dans le dump 
 - un Readme.txt qui explique comment restaurer la base de données 
 à partir du dump.
  cd .\test\MongoDB_dump
  mongorestore --uri=mongodb+srv://<username:password@cluster_host>/testP7_DB  testP7_DB

Pour plus de détail, lire le Readme.txt dans  le répertoire test.

Une fois que la base de donnée est restaurée, démarer le front 
end, et le backend comme décrit ci dessus.

















