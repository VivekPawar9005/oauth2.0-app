let router = require('express').Router();
let queryString = require('query-string');
let config = require('../configs/config');


function loginView(req, res) {
    let company = req.params.company;
    if (company == 'facebook') {
        //rendering facebook login

        let stringifiedParams = queryString.stringify({
            client_id: config.facebook.appId,
            redirect_uri: config.facebook.redirectUrl,
            scope: ['email', 'user_friends'].join(','), // comma seperated string
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup',
        })

        let compileData = {
            'url': config.facebook.loginUrl + stringifiedParams,
            'company': company
        }

        res.render('login', compileData) //rendering login template

    } else if (company == 'google') {
        //rendering google login

        let stringifiedParams = queryString.stringify({
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/drive.metadata.readonly'
            ].join(' '),
            access_type: 'offline',
            include_granted_scopes: true,
            response_type: 'code',
            state: 'state_parameter_passthrough_value',
            redirect_uri: config.google.callBackUrl,
            client_id: config.google.clientId
        })

        let compileData = {
            'url': config.google.loginUrl + stringifiedParams,
            'company': company
        }

        res.render('login', compileData)

    } else {
        //rendering support page

        res.render('enable_login', { 'company': company });
    }

}
function readMe(req, res) {
    //read me template renders on /
    res.render('readme', { 'endPoints': config.endPoints })
}

function fibonacciSequence(req, res) {
    //print fibonacci numbers till n'th number
    let num = parseInt(req.params.num);
    let n1 = 0;
    let n2 = 1;
    let fibArr = [];
    for (let i = 0; i < num; i++) {
        let n = n1 + n2;
        fibArr.push(n);
        n1 = n2;
        n2 = n;
    }
    customMessages.successfullResponse.data = fibArr;

    res.send(customMessages.successfullResponse);

}

router.route('/login/:company').get(loginView);
router.route('/').get(readMe);
router.route('/fib/:num').get(fibonacciSequence);
module.exports = router;