This plugin is built on the excellent [google-assistant module](https://github.com/endoplasmic/google-assistant). It enables
communication with the Google Assistent via the genie-router clients.

Its configuration consists of three steps:

1. Configure a Google Cloud project
2. Install the plugin
3. Link your Google credentials

# Google Cloud Configuration

[Follow the instructions](https://developers.google.com/assistant/sdk/prototype/getting-started-other-platforms/config-dev-project-and-account) to create
a JSON file for OAuth2 permissions.

# Install plugin

## Plugin configuration

### oauth2PermissionsPath

Required. This is the file path to the .json file you create by following the instruction for the enabling of the API on
Google Cloud.

### tokensStorePath

Required. The filename to store the authorization tokens that link your Google account
to the Cloud project client id.

### locale

Optional. The locale to use. Defaults to the en-US locale.

### Example

```
{
  "plugins": {
    "google-assistant": {
      "googleClientSecretPath": "<path to google client_secret...json",
      "tokensStorePath": "<path to store received google tokens.json>",
      "locale": "en-US"
    }
  }
}
```

# Link your Google credentials

The assistent requires a Google account to work. Change to your plugin location folder ($HOME/.genie-router by default).
Install the plugin by running:

    npm install --save matueranet/genie-router-plugin-google-assistant

After installation has completed, run:

    ./node_modules/.bin/google-assistent-setup

This will start the linking process of your Google account. It will output something similar to:

```
Attempted to automatically open the URL, but if it failed, copy/paste this in your browser:
https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fassistant-sdk-prototype&response_type=code&...
Paste your code: (node:996) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: Exited with code 3
```

The unhandled promise rejection can be ignored. Open the URL in your browser, login and authorize the app to use your account. Copy the
code displayed, and paste it in the console and press enter. The process should continue and output: _Assistant initialized._ Next
time you run the script it should not show the URL again, but immediately echo the Assistant initialized output.
