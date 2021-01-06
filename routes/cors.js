/*
    this file contains cors configuration
*/

/*import all the required modules*/
const cors = require('cors');
const config = require('../config');

/*getting white listed ip's from config file*/
const whitelist = config.WHITE_LIST_IP;

/*cors configuration*/
var corsOptionsDelegate = (req, callback) => {

    var corsOptions;

    //if the req ip is in the white list ips allow
    if(whitelist.indexOf(req.header('Origin')) !== -1) {

        corsOptions = { 
          origin: true,
          optionsSuccessStatus: 200 
        };

    }
    else { //else dont allow

        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

/*export cors and cors with options*/
exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);