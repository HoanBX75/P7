Ceci est le code d'implémentation du projet P7 : 
Créez un réseau social d’entreprise 


Le code est constitué de deux parties, deux répertoires  : 
  - frontend 
  - backend 

-------------------- 
- Base de données :
-------------------- 

La base de données utilisée est MongoDB Atlas (une base donnée locale 
peut être utilisée).
Aussi, pour ce projet il faut créer une base de donnée dans MongoDB 
et avoir accès à celle-ci.
Connaitre la string de connection à la base, comme par exemple  :
mongodb+srv://george:georgepass@cluster0.kpc66n.mongodb.net/testp7?retryWrites=true&w=majority
          -   le nom est george 
          - le password gerogepass 
          - le nom de la base de donnée est testp7
Important, il faut que george ait les droits en écriture et lecture sur la base.
Cette string sera celle qui sera utilisée dans le backend (dans le fichier .env).

Note : vous n'avez pas à créer des collections et documents en base, l'application 
le fera pour vous :-)

-------------------- 
- Pour le backend : 
-------------------- 

1/ Ajouter un dossier "images" au dossier backend.
2/ Renommer le .env_template en .env et remplisser clefs avec vos valeurs : 
 MY_CONNECT : la 'string' de connection à la base mongodb 
 SECRET_TOKEN= la 'string' servant à signer et vérifier le token de connection 
3/ Lancer le backend avec la commande : 
   nodemon server


-------------------- 
- Pour le frontend :
---------------------

Pour lancer le frontend, taper la command : 
npm start 

Noter que le port d'écoute est 4200 (celui est configurable dans package.json)

------------------------------------------------ 
Notes Importante pour creer un  Administrateur 
------------------------------------------------

- Pas besoin de pré créer des collections (user, post). Elles seront 
crées directement , par l'application à l'utilisation .

- Les utilisateurs peuvent être crées au sign up de l'application.
Pour avoir des ***  utilisateurs administrateur *** , il suffit que vous enregistrer 
les utilisateurs suivants avec les noms fixes prédéfinis admin ou adrien  : 

  - utisisateur     nom = admin  (obligatoire pour être administrateur  )
                    email  admin@gmail.com 
                     password admin

    - utisisateur    nom = adrien   (obligatoire pour être administrateur )
                    email   adrien@gmail.com 
                    password adrien 
 
 Aussi admin et adrien ont les roles admin automatiquement.

-----------------------------------------------------
Exemple de création de users (dont 2 admins) , et posts
------------------------------------------------------

1/ Creation de 4 users (dont 2 administrateurs )
-- 2 users admin  (adrien, admin)
Email, user, password  
admin@gmail.com   -  admin / admin
adrien@gmail.com  -  adrien  /adrien
 
-- 2 users 'normaux'  (titi, toto)
titi@gmail.com  titi/titi
toto@gmail.com  toto/toto


2/ Création des posts 
2.1 titi : 2 posts 
* titi_poste1
Text:
Je suis titi et je loue un appartement
comme vous pouver le voir sur la photo 
de mon post.

* titi_poste2
Text:
Salut, c'est titi
Je passes des vacances de rêve dans un appartement
à Lyon. 
Et j'aimerais vous le recommander! 

2.2 toto : 1 post  
* toto_post1
Je m'appelle toto et je cherche un appartement.
Voir la photo.
J'ai lu un article qui pourrait vous intéresser:
Dans le secteur privé, la loi permet de sous-louer son appartement
(en totalité ou en partie), si l’on a l’accord de son bailleur. 
Dans le secteur social, la loi l’interdit totalement. 
 Les HLM et les logements « conventionnés » (construits, rénovés ou achetés avec une aide de l’Etat),
 qui permettent de se loger à un prix inférieur à celui du marché.


2.3 adrien : 2 posts 



* adrien_post1
Je voudrais faire un échange d'appartement.
Le mien sur la photo.


* adrien_post2
Y aurait -il une personne intéressée pour acheter l'appartement 
de mon voisin ?
Je partage ce dernier  article lu :
La France a déjà connu une vague de chaleur précoce en juin 
et sort tout juste d’une deuxième (12-25 juillet), qui a favorisé plusieurs incendies, 
notamment en Gironde, où près de 21 000 hectares de forêt ont été détruits. 
Cette troisième vague « constitue désormais la 45e vague de chaleur recensée depuis 1947 », 
« la troisième la plus intense.

2.4  admin : 0 post 






