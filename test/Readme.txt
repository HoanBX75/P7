Readme.txt
----------------------------------------------------------------------------------------
This Readme.txt  describes how to test the application 
by restoring  a  ***** mongoDB dump ******** .


A MongoDB dump in the directory ./test/MongoDB_dump directory.
This dump corresponds to the mongoDB database testP7_DB .
Restoring this dump will create monogoDB  Database testP7_DB 
populated with posts and users.

The test directory contains 
1. MongoDB_dump  : directory where the mongoDB dump is stored
2. MongoDB_dump_images : images related to the mongoDB dump posts 
3. images : images that can be used if you creat posts


==============================================================================
1/ To restore the dump of the mongoDB database  testP7_DB, do the following : 
==============================================================================

A/ cd .\test\MongoDB_dump

B/  provide the <mongoDB_db_connect_string string> value in the mongoDB restore 
command  :
    mongorestore --uri=mongodb+srv://<username:password@cluster_host>/testP7_DB  testP7_DB

and execute the mongoDB restore command.
As for instance : 
mongorestore --uri=mongodb+srv://myusername:mypassword@cluster0.mycluster.mongodb.net/testP7_DB  testP7_DB 

C/ Then, in the mongoDB database will be populate as the following  : 
- Users : 
        - user 'adminstrateur' = admin  
        Email=admin@gmail.com
        Username=admin
        Password=admin

        - two  users 'normaux'  =  titi, toto
        Email=titi@gmail.com
        Username=titi
        Password=titi

        Email=@gmail.com
        Username=toto
        Password=toto

- Posts: 
        - titi : poste1
        Text:
        Je suis titi et je loue un appartement
        comme vous pouver le voir sur la photo 
        de mon post.
        Image: annie-spratt-Eg1qcIitAuA-unsplash.jpg

        - titi : poste2
        Text:
        Salut, c'est titi
        Je passes des vacances de rêve dans un appartement
        à Lyon. 
        Et j'aimerais vous le recommander! 
        Image :  aw-creative-VGs8z60yT2c-unsplash.jpg

        - toto : poste 3 
        Text : 
        Je m'appelle toto et je cherche un appartement.
        Voir la photo.
        J'ai lu un article qui pourrait vous intéresser:
        Dans le secteur privé, la loi permet de sous-louer son appartement
        (en totalité ou en partie), si l’on a l’accord de son bailleur. 
        Dans le secteur social, la loi l’interdit totalement. 
        Les HLM et les logements « conventionnés » (construits, rénovés ou achetés avec une aide de l’Etat),
        qui permettent de se loger à un prix inférieur à celui du marché.
        Image: emile-guillemot-Bj_rcSC5XfE-unsplash.jpg

        - admin : post 4
        Text:
        Je voudrais faire un échange d'appartement.
        Le mien sur la photo.
        Image: febrian-zakaria-M6S1WvfW68A-unsplash.jpg


================================================================================
2/ Restore the corresponding  Post images in the backend images directory 
=================================================================================

  The images that are referenced in the  mongoDB testP7_DB are timedstamp 
  named and were stored in the backend/images. 
  These images are in ./test/MongoDB_dump_images 
  Therefore, it is needed to restore these images in theses backend/images directory.

  So, in the backend :
  A/ Create the images directory : backend/images 
  B/ And copy the testP7_DB images of MongoDB dump to the backend/images  :

       copy ./test/MongoDB_dump_images   ./backend/images 

================================================================================
3/ Use the Post site  
=================================================================================

A/ Start backend, frontend servers

B/ Connect to the site  http://localhost:4200

C/  You can  Login 
  with the Admin user 
             Email=admin@gmail.com  / Password=admin
  or with the users 
       Email=titi@gmail.com  / Password=titi         
       Email=@gmail.com  /  Password=toto
  
  and create, update, delete your posts.






