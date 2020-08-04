const dotenv  = require('dotenv').config();

module.exports = {

    'BASE_URL' : process.env.BASE_URL,

    'MONGO_URL' : process.env.MONGO_URL,

    'SECRET_KEY' : process.env.SECRET_KEY

}