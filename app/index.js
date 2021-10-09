let express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path')
const all_routes = require('express-list-endpoints');
let config=require('./configs/config');


let app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }))
app.disable('x-powered-by');//disabled x-powered-by as safety measure 
app.use(cors());
app.use(morgan('combined'))
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates')); //loaded pug templates for views

app.use(require('./controllers/route_view'))
app.use('/api', require('./controllers/route_oauth2'))
config.endPoints=all_routes(app);

module.exports = app