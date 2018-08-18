/**
 * Generates a startConversation function using three callbacks:
 * - errorCallback(error)
 * - responseCallbacl(text)
 * - endedCallback(conversation, error, continueConversation)
 *  conversation is the conversation object which is used to communicate with the Assistant.
 *  error has a value if an error occured when the conversation ends
 *  continueConversation if the Assistant expects another response back to this reply.
*/
module.exports = (errorCallback, responseCallback, endedCallback) => (conversation) => {
    // setup the conversation
    conversation
        .on('response', responseCallback)
        // the device needs to complete an action
        .on('ended', (error, continueConversation) => {
            endedCallback(conversation, error, continueConversation);
        })
        // catch any errors
        .on('error', errorCallback);
};
