let router = require('express').Router();
let facebookClass = require('../models/facebook');
let googleClass = require('../models/google');
let customMessagesClass = require('../configs/custom_messages');

let customMessages = new customMessagesClass();

function getUsersData(req, res) {
    let accessToken = { 'token': req.headers.authorization.split(' ')[1] };

    if (req.params.company == 'facebook') {
        //excutes facebook api
        let fbObj = new facebookClass();

        fbObj.getUsersData(accessToken, function (err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response)
            }
        })
    } else if (req.params.company == 'google') {
        //excutes google api
        let gObj = new googleClass();

        gObj.getUsersData(accessToken, function (err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response)
            }
        })
    } else {
        //redirects to support page for other platform oauth2 login
        res.render('enable_login', { 'company': req.params.company })
    }
}

function fetchFbCallbackResponse(req, res) {
    //callback url middleware for fetching Authorization code sent from facebook
    let fbObj = new facebookClass();

    fbObj.setTokens({ 'code': req.query.code }, function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response)
        }
    })

}

function fetchGoogleCallbackResponse(req, res) {
    //callback url middleware for fetching Authorization code sent from google
    let gObj = new googleClass();

    gObj.setTokens({ 'code': req.query.code }, function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response)
        }
    })
}

function fetchTokens(req, res) {
    //callback url middleware for fetching information sent from google

    //room for adding extra security layers

    let gObj = new googleClass();

    gObj.fetchTokens(req.body, function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.send(response)
        }
    })
}



router.route('/authenticate/facebook/callbackurl').get(fetchFbCallbackResponse);
router.route('/authenticate/google/callbackurl').get(fetchGoogleCallbackResponse);

router.route('/:company/users').get(getUsersData);

router.route('/oauth/token').post(fetchTokens);


module.exports = router;