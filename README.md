
## Test avec cURL

Run: node dist/upload.js 33666

Le second paramètre est optionnel : 33666 par défaut

Les uploads s'effectuent en relatif par rapport au directory courant.

## Commande de build webpack 
npm run build

## Traite les GET et les PUT
Par sécurité le GET (SAUF le `ping`) est commenté: le PUT permet d'écrire des fichiers, `upload` ne permet pas de les relire.

- l'URL est donnée en base64 URL après http://localhost:33666/
- le ping est http://localhost:33666/ping
- pour un PUT, le contenu du fichier est dans le body de la requête

## Test par cURL

Ci-dessous s'il n'y a pas ce content-type, effectue un multipart-form-data.

base64: testcurl.txt dGVzdGN1cmwudHh0
base64: toto/photo-daniel.jpg dG90by9waG90by1kYW5pZWwuanBn

curl -X PUT -H "Content-Type:application/octet-stream" --data "this is raw data" http://localhost:33666/dGVzdGN1cmwudHh0

curl -X PUT -H "Content-Type:application/octet-stream" --data-binary "@Daniel-13.jpg" http://localhost:33666/dG90by9waG90by1kYW5pZWwuanBn

## pkg
 Install : npm install -g pkg

 Dans dist : 
 pkg -t node14-win upload.js
 pkg -t node14-linux upload.js

 Créé des exécutables pour linux, windows (en x64).

 Pb avec node16 sous windows 10.
