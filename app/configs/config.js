var config = module.exports;
require('dotenv').config()
let moment = require('moment-timezone');

config.mongoConnectionUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`

config.customMethods = {
    getCurrentDateAndTime: function () {
        return moment().tz(process.env.TIME_ZONE).format('DD-MM-YYYY HH:mm:ss')
    }
}
config.secret=process.env.SERVER_SECRET

config.facebook={
    'appId':process.env.FB_APPID,
    'loginUrl':process.env.FB_URL,
    'redirectUrl':process.env.FB_CBURL,
    'tokenApi':process.env.FB_TOKEN_API,
    'clientSecret':process.env.FB_CLIENT_SECRET,
    'token':{}
}
config.google={
    'loginUrl':process.env.G_LOGIN_URL,
    'tokenApi':process.env.G_TOKEN_API,
    'clientId':process.env.G_CLIENT_ID,
    'clientSecret':process.env.G_CLIENT_SECRET,
    'callBackUrl':process.env.G_CBURL,
    'token':{}
}

config.endPoints=[];