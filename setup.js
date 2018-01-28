const GoogleAssistant = require('google-assistant')

if (process.argv.length !== 3) {
  console.log('Help: Invoke with the genie-router config.json location as the argument.')
  process.exit(1)
}

const configFile = process.argv[2]
const config = require(configFile)

const auth = {
  keyFilePath: config.plugins['google-assistant'].googleClientSecretPath,
  savedTokensPath: config.plugins['google-assistant'].tokensStorePath // where you want the tokens to be saved
}
const assistant = new GoogleAssistant(auth)
assistant
    .on('ready', () => {
      console.log('Assistant initialized. Access token stored.')
      process.exit(0)
    })
    .on('error', (error) => {
      console.log('Assistant error: ', error)
      process.exit(2)
    })
