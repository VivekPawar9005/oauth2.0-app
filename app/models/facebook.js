let axios = require('axios');
let queryString = require('query-string');
let async = require('async');
let config = require('../configs/config');
let db = require('../middlewares/mongo_pool');

let customMessagesClass = require('../configs/custom_messages');
function Facebook() {
    this.customMessages = new customMessagesClass();
}

Facebook.prototype.setTokens = function (data, callback) {
    //authenticating and fetching access token from retrived authentication code 

    let self = this;
    
    axios({
        url: config.facebook.tokenApi,
        method: 'get',
        params: {
            client_id: config.facebook.appId,
            client_secret: config.facebook.clientSecret,
            redirect_uri: config.facebook.redirectUrl,
            code: data.code
        }
    }).then(tokenResp => {
        config.facebook.token = tokenResp.data;
        let currentDateTime = config.customMethods.getCurrentDateAndTime();
        let collection = db.get().collection('tokens');
        collection.update({ 'company': 'facebook' }, { $set: { 'token': tokenResp.data.access_token, 'Auth_Code': data.code, 'client_id': config.google.clientId, 'client_secret': config.google.clientSecret, 'submittedDateTime': currentDateTime, 'modifiedDateTime': currentDateTime, 'submittedBy': 'admin', 'modifiedBy': 'admin' } }, { upsert: true }, function (err, mongoResponse) {
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

Facebook.prototype.getUsersData = function (token, callback) {
    //fetch facebook user details using issued token

    let self = this;

    axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'first_name', 'last_name'].join(','),
            access_token: token.token,
        }
    }).then(resp => {
        self.customMessages.fetchedUsersSuccesfully.data = resp.data;
        callback(null, self.customMessages.fetchedUsersSuccesfully)
    }).catch(err => {
        callback(self.customMessages.networkError)
    })
}


module.exports = Facebook;