const fs = require('fs')

const base_url = process.argv.slice(2)[0]
const appId = process.argv.slice(3)[0]
const appSecret = process.argv.slice(4)[0]
const scope = process.argv.slice(5)[0]
const terminal = process.argv.slice(6)[0]

const str = `NODE_ENV=production
VUE_APP_REQUEST_URL=${base_url}
VUE_APP_APPID=${appId}
VUE_APP_APPSECRECT=${appSecret}
VUE_APP_SCOPE=${scope}
VUE_APP_TERMINAL=${terminal}`

fs.writeFileSync('.env.production', str, 'utf8')