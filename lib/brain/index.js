const GoogleAssistant = require('google-assistant')
const debug = require('debug')('genie-router-plugin-google-assistant::brain')
const startConversation = require('./startConversation')

let assistant = null
let conversationLocale = 'en-US'
let pendingProcessPromise = null // this is the promise that can be resolved by the Assistent Reply.

function response (text) {
  if (pendingProcessPromise) {
    pendingProcessPromise.resolve({output: text})
    pendingProcessPromise = null
  }
}

function error (error) {
  debug('Conversation Error:', error)
  if (pendingProcessPromise) {
    pendingProcessPromise.reject(new Error('Conversation error', error))
    pendingProcessPromise = null
  }
}

/**
 * We only log the end event, do nothing with it for now. It is probably more
 * for audio, to continue listening to the mic if a response is expected.
 */
function conversationEnded (conversation, error, continueConversation) {
  if (error) {
    debug('Conversation Ended Error:', error)
  } else if (continueConversation) {
    debug('Assistant indicates continue conversation')
  } else {
    debug('Conversation complete')
    conversation.end()
  }
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
    assistant.start({lang: conversationLocale, textQuery: message.input}, startConversation(error, response, conversationEnded))
    pendingProcessPromise = {resolve: resolve, reject: reject}
  })
}

module.exports = {
  start: start
}
