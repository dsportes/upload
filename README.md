
## Test avec cURL

Run: node dist/upload.js /path-racine-upload 8000

Le second paramètre est optionnel : 8000 par défaut

Le premier paramètre est optionnel : le directory courant par défaut mais requis si le port n'est pas 8000

## Commande de build webpack 
npm run build

## Traite les GET et les PUT
- l'URL est donnée en base64 URL après http://localhost:8000/
- pour un PUT, le contenu du fichier est dans le body de la requête

## Test par cURL

Ci-dessous s'il n'y a pas ce content-type, effectue un multipart-form-data.

base64: testcurl.txt dGVzdGN1cmwudHh0
base64: toto/photo-daniel.jpg dG90by9waG90by1kYW5pZWwuanBn

curl -X PUT -H "Content-Type:application/octet-stream" --data "this is raw data" http://localhost:8000/dGVzdGN1cmwudHh0

curl -X PUT -H "Content-Type:application/octet-stream" --data-binary "@Daniel-13.jpg" http://localhost:8000/dG90by9waG90by1kYW5pZWwuanBn

## pkg
 Install : npm install -g pkg

 Dans dist : 
 pkg -t node14-win upload.js
 pkg -t node14-linux upload.js

 Créé des exécutables pour linux, windows (en x64).

 Pb avec node16 sous windows 10.
