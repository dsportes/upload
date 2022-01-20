
## Test avec cURL

Run: node dist/upload.js /path-racine-upload 8000

Le second paramètre est optionnel : 8000 par défaut

Le premier paramètre est optionnel : le directory courant par défaut mais requis si le port n'est pas 8000

## Commande de build webpack 
npm run build

## Test par cURL

Ci-dessous s'il n'y a pas ce content-type, effectue un multipart-form-data.

curl -X POST -H "Content-Type:application/octet-stream" --data "this is raw data" http://localhost:8000/upload/testcurl.txt

curl -X POST -H "Content-Type:application/octet-stream" --data-binary "@Daniel-13.jpg" http://localhost:8000/upload/photo-daniel.jpg

## pkg
 Install : npm install -g pkg

 Dans dist : pkg upload.js

 Créé trois exécutables pour linux, mac, windows
 