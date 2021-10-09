let app=require('./app/index');
let async=require('async');



app.listen(5500,function(err){
    if(err){
        console.log("not able to run the server")
        throw err;
    } else {
        console.log("sever running successfully")
    }
})