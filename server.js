const fs = require('fs')
const fsp = require('fs/promises')
const http = require('http')
const process = require('process')
const path = require('path')
const express = require('express')

const dev = process.env.NODE_ENV === 'development'
const uploadDir = path.resolve(process.cwd())
const port = process.argv[2] ? parseInt(process.argv[2]) : 33666

function setRes(res, status, respType) {
  res.status(status).set({
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-version'
  })
  return res.type(respType ? respType : 'application/octet-stream')
}

const app = express()

// OPTIONS est toujours envoyé pour tester les appels cross origin
app.use('/', (req, res, next) => {
  if (req.method === 'OPTIONS')
    setRes(res, 200, 'text/plain').send('')
  else
    next()
})

/**** retourne le contenu du fichier cité dans l'URL */
app.use('/', async (req, res, next) => {
  if (req.method === 'GET')
    try {
      if (req.url === '/ping') {
        setRes(res, 200, 'text/plain').send(new Date().toISOString())
      } else {
        const u = Buffer.from(req.url.substring(1), 'base64').toString('utf8')
        const p = path.resolve(uploadDir, u)
        if (!p.startsWith(uploadDir)) throw 'ex1'
        const bytes = await fsp.readFile(p)
        if (bytes) {
          setRes(res, 200, 'application/octet-stream').send(bytes)
        } else {
          setRes(res, 404).send('Fichier non trouvé')
        }
      }
    } catch (e) {
      setRes(res, 404).send(e === 'ex1' ? 'Path interdit' : 'Fichier non trouvé')
    }
    else next()
})

/**** upload le contenu binaire passé dans le body du POST en tant que fichier dont le path est donné après upload */
app.use('/', async (req, res, next) => {
  if (req.method === 'PUT') {
    // push the data to body
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', async () => {
      const buf= Buffer.concat(body)
      try {
        const u = Buffer.from(req.url.substring(1), 'base64').toString('utf8')
        const i = u.lastIndexOf('/')
        const dir = path.resolve(uploadDir, u.substring(0, i))
        if (!dir.startsWith(uploadDir))
          throw 'Path [' + u + '] interdit'
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })  
        const fp = path.resolve(uploadDir, u)
        await fsp.writeFile(fp, buf)
        if (dev) console.info("Fichier chargé [" + fp + '] ' + buf.length + ' bytes')
        setRes(res, 200, 'text/plain').send('OK')
      } catch (error){
        const x = error.toString()
        setRes(res, 500, 'text/plain').send(x)
      }
    })
  }
  else next()
})

try {
  const server = http.createServer(app).listen(port, () => {
    console.log('Serveur local UPLOAD prêt. Ecoute sur le port ' + port + '\nCtrl-C pour l\'arrêter')
  })
  server.on('error', (e) => { // les erreurs de création du server ne sont pas des exceptions
    console.error('server.js : HTTP error = ' + e.message)
  })
} catch(e) { // exception générale. Ne devrait jamais être levée
  console.error('server.js : catch global = ' + e.message)
}
