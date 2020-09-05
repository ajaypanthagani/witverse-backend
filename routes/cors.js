const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://witverseapp.azurewebsites.net', 'https://witverseapp.azurewebsites.net', 'https://localhost:4200', 'http://localhost:4200'];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { 
          origin: true,
          optionsSuccessStatus: 200 
        };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);