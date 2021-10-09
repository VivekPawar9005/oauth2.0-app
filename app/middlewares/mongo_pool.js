var MongoClient = require('mongodb').MongoClient;
var configs = require('../configs/config');

var mongoPool = {
    db: null,
    url: configs.mongoConnectionUrl
}

exports.connect = function (done) {
    if (mongoPool.db) return done();

    MongoClient.connect(mongoPool.url, function (err, db) {
        if (err) return done(err);
        mongoPool.db = db;
        done();
    });
}

exports.get = function () {
    return mongoPool.db;
}

exports.close = function (done) {
    if (mongoPool.db) {
        mongoPool.db.close(function (err, result) {
            if (err) done(err);
            mongoPool.db = null;
            done();
        });
    }
}