let axios = require('axios');
let queryString = require('query-string');
let async = require('async');
let config = require('../configs/config');


let customMessagesClass = require('../configs/custom_messages');

function Google() {
    this.customMessages = new customMessagesClass();
}

Google.prototype.setTokens = function (data, callback) {
    //authenticating and fetching access token from retrived authentication code 
    let self = this;

    axios({
        url: config.google.tokenApi,
        method: 'post',
        params: {
            client_id: config.google.clientId,
            client_secret: config.google.clientSecret,
            redirect_uri: config.google.callBackUrl,
            code: data.code,
            grant_type: 'authorization_code'
        }
    }).then(tokenResp => {
        config.google.token = tokenResp.data;

        callback(null, self.customMessages.authenticatedSuccessfully);

    }).catch(err => {
        self.customMessages.invalidCredentials.message = JSON.stringify(err.response.data);
        callback(self.customMessages.invalidCredentials);
    })
}

Google.prototype.getUsersData = function (token, callback) {
    //fetch user details
    let self = this;

    axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token.token}`,
        },
    }).then(resp => {
        self.customMessages.fetchedUsersSuccesfully.data = resp.data;
        callback(null, self.customMessages.fetchedUsersSuccesfully)
    }).catch(err => {
        callback(self.customMessages.networkError)
    })
}

Google.prototype.fetchTokens = function (data, callback) {
    //fetch tokens from config
    let self = this;

    if (data.company == 'facebook' || data.company == 'google') {
        self.customMessages.tokenFetchedSuccessfully.data = config[data.company].token;
        callback(null, self.customMessages.tokenFetchedSuccessfully);
    } else {
        callback(self.customMessages.invalidPlatform);
    }
}

module.exports = Google;