const GoogleAssistant = require('google-assistant');
const debug = require('debug')('genie-router-plugin-google-assistant::brain');
const startConversation = require('./startConversation');

let assistant = null;
let conversationLocale = 'en-US';
let pendingProcessPromise = null; // this is the promise that can be resolved by the Assistent Reply.

function response(text) {
    if (pendingProcessPromise) {
        pendingProcessPromise.resolve({ output: text });
        pendingProcessPromise = null;
    }
}

function error(e) {
    debug('Conversation Error:', e);
    if (pendingProcessPromise) {
        pendingProcessPromise.reject(new Error('Conversation error', e));
        pendingProcessPromise = null;
    }
}

/**
 * We only log the end event, do nothing with it for now. It is probably more
 * for audio, to continue listening to the mic if a response is expected.
 */
function conversationEnded(conversation, e, continueConversation) {
    if (e) {
        debug('Conversation Ended Error:', e);
    } else if (continueConversation) {
        debug('Assistant indicates continue conversation');
    } else {
        debug('Conversation complete');
        conversation.end();
    }
}

function process(message) {
    return new Promise(((resolve, reject) => {
        // start the conversation
        assistant.start({ lang: conversationLocale, textQuery: message.input }, startConversation(error, response, conversationEnded));
        pendingProcessPromise = { resolve, reject };
    }));
}

async function start(config) {
    const auth = {
        keyFilePath: config.googleClientSecretPath,
        savedTokensPath: config.tokensStorePath, // where you want the tokens to be saved
    };
    conversationLocale = (config.locale) ? config.locale : 'en-US'; // defaults to en-US, but try other ones, it's fun!

    assistant = new GoogleAssistant(auth);
    assistant
        .on('ready', () => { debug('Assistent initialized'); })
        .on('error', (e) => {
            throw new Error('Assistant Error:', e);
        });

    return { process };
}

module.exports = {
    start,
};
