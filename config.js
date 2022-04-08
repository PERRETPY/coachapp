const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs')

const clientId = argv['clientId']
if (!clientId) {
  console.error('You must supply client id --clientId=<YOURCLIENTID>')
  process.exit(1)
}

const apiKey = argv['apiKey']
if (!apiKey) {
  console.error('You must supply apikey  --apiKey=<YOURAPIKEY>')
  process.exit(1)
}

const fileContent = `VUE_APP_CLIENT_ID=${clientId}
VUE_APP_API_KEY=${apiKey}
`

fs.writeFileSync('.env.local', fileContent)
