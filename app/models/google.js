let axios = require('axios');
let queryString = require('query-string');
let async = require('async');
let config = require('../configs/config');
let db = require('../middlewares/mongo_pool');

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
        let currentDateTime = config.customMethods.getCurrentDateAndTime();
        let collection = db.get().collection('tokens');
        collection.update({ 'company': 'google' }, { $set: { 'token': tokenResp.data.access_token, 'Auth_Code': data.code, 'client_id': config.google.clientId, 'client_secret': config.google.clientSecret, 'submittedDateTime': currentDateTime, 'modifiedDateTime': currentDateTime, 'submittedBy': 'admin', 'modifiedBy': 'admin' } }, { upsert: true }, function (err, mongoResponse) {
            if (err) {
                callback(self.customMessages.networkError);
            } else {
                callback(null, self.customMessages.authenticatedSuccessfully);
            }
        });

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
    //fetch tokens from mongo collection
    let self = this;
    if (data.company == 'facebook' || data.company == 'google') {
        let collection = db.get().collection('tokens');

        collection.findOne({ 'company': data.company }, function (err, mongoResponse) {
            if (err) {
                callback(err);
            } else {
                self.customMessages.tokenFetchedSuccessfully.data = mongoResponse;
                callback(null, self.customMessages.tokenFetchedSuccessfully);
            }
        });
    }
    else {
        callback(self.customMessages.invalidPlatform);
    }
}

module.exports = Google;