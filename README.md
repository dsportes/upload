
## Test avec cURL

Run: node dist/upload.js /path-racine-upload

Le port est donné par la variable PORT (par défaut 8000)

Commande de build webpack : npm run build

Ci-dessous s'il n'y a pas ce content-type, effectue un multipart-form-data.

curl -X POST -H "Content-Type:application/octet-stream" --data "this is raw data" http://localhost:8000/upload/testcurl.txt

curl -X POST -H "Content-Type:application/octet-stream" --data-binary "@Daniel-13.jpg" http://localhost:8000/upload/photo-daniel.jpg

## pkg
 Install : npm install -g pkg

 Dans dist : pkg upload.j

 Créé trois exécutables pour linux, mac, windows
 