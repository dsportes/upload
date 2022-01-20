const fs = require('fs')
const fsp = require('fs/promises')
const http = require('http')
const process = require('process')
const path = require('path')
const express = require('express')

const dev = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 8000;
const uploadDir = process.env.UPLOAD_DIR || process.argv[2] || process.cwd();

function setRes(res, status, respType) {
  /*
  res.status(status).set({
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-API-version'
  })
  */
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

/**** ping du site ****/
app.get('/ping', (req, res) => {
  setRes(res, 200, 'text/plain').send(new Date().toISOString())
})

/**** liste les noms fichiers et folders figurant dans le folder donné après dir */
app.use('/dir', async (req, res) => {
  const d = req.url.substring(1)
  const dir = path.resolve(uploadDir, d)
  try {
    const files = fs.readdirSync(dir)
    const resp = files.join('\n')
    setRes(res, 200, 'text/plain').send(resp)
  } catch (e) {
    setRes(res, 404, 'text/plain').send(e.toString())
  }
})

/**** upload le contenu binaire passé dans le body du POST en tant que fichier dont le path est donné après upload */
app.use('/upload', async (req, res) => {
  // push the data to body
  const body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', async () => {
    const buf= Buffer.concat(body)
    try {
      const i = req.url.lastIndexOf('/')
      const dir = path.resolve(uploadDir, req.url.substring(1, i))
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })  
      const fp = path.resolve(uploadDir, req.url.substring(1))
      await fsp.writeFile(fp, buf)
      if (dev) console.info("Fichier chargé [" + fp + '] ' + buf.length + ' bytes')
      setRes(res, 200, 'text/plain').send('OK')
    } catch (error){
      setRes(res, 500, 'text/plain').send(error.toString())
    }
  })
})

try {
  const server = http.createServer(app).listen(port, () => {
    console.log('HTTP server running on port ' + port)
  })
  server.on('error', (e) => { // les erreurs de création du server ne sont pas des exceptions
    console.error('server.js : HTTP error = ' + e.message)
  })
} catch(e) { // exception générale. Ne devrait jamais être levée
  console.error('server.js : catch global = ' + e.message)
}
