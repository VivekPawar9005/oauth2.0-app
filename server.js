let app=require('./app/index');
let async=require('async');
let db=require('./app/middlewares/mongo_pool')


async.waterfall([
    function(callback){
        db.connect(function(err){
            if(err){
                console.log('unable to establish connection with mongo')
                callback(err)
            } else {
                callback(null);
            }
        })
    }
],function(err,result){
    if(err){
        console.log(err);
    } else {
        console.log('successfully connected to mongo');
    }
})
app.listen(5500,function(err){
    if(err){
        console.log("not able to run the server")
        throw err;
    } else {
        console.log("sever running successfully")
    }
})