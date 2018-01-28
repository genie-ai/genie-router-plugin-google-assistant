const GoogleAssistant = require('google-assistant')
const debug = require('debug')('genie-router-plugin-google-assistant::brain')

let assistant = null
let conversationLocale = 'en-US'
let continueConversation = false
let pendingProcessPromise = null // this is the promise that can be resolved by the Assistent Reply.

let startConversation = (conversation) => {
  // setup the conversation
  conversation
    .on('response', (text) => {
      debug('Assistant Response:', text)
      if (pendingProcessPromise) {
        pendingProcessPromise.resolve({output: text})
        pendingProcessPromise = null
      }
    })
    // if we've requested a volume level change, get the percentage of the new level
    .on('volume-percent', percent => debug('New Volume Percent:', percent))
    // the device needs to complete an action
    .on('device-action', action => debug('Device Action:', action))
    // once the conversation is ended, see if we need to follow up
    .on('ended', (error, continueConversation) => {
      if (error) {
        debug('Conversation Ended Error:', error)
      } else if (continueConversation) {
        debug('Continue conversation')
        continueConversation = true
      } else {
        debug('Conversation Complete')
        conversation.end()
        continueConversation = false
      }
    })
    // catch any errors
    .on('error', (error) => {
      debug('Conversation Error:', error)
      if (pendingProcessPromise) {
        pendingProcessPromise.reject(new Error('Conversation error', error))
        pendingProcessPromise = null
      }
    })
}

function start (config) {
  return new Promise(function (resolve, reject) {
    const auth = {
      keyFilePath: config.googleClientSecretPath,
      savedTokensPath: config.tokensStorePath // where you want the tokens to be saved
    }
    conversationLocale = (config.locale) ? config.locale : 'en-US' // defaults to en-US, but try other ones, it's fun!

    assistant = new GoogleAssistant(auth)
    assistant
        .on('ready', () => { debug('Assistent initialized') })
        .on('error', (error) => {
          reject(new Error('Assistant Error:', error))
        })

    resolve({process: process})
  })
}

function process (message) {
  return new Promise(function (resolve, reject) {
    // start the conversation
    assistant.start({lang: conversationLocale, textQuery: message.input}, startConversation)
    pendingProcessPromise = {resolve: resolve, reject: reject}
  })
}

module.exports = {
  start: start
}
