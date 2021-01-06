/*
this file exports all the environment variables for use in the application
*/

const dotenv  = require('dotenv').config();

module.exports = {

    'APPLICATION_NAME' : process.env.APPLICATION_NAME,

    'BASE_URL' : process.env.BASE_URL,

    'MONGO_URL' : process.env.MONGO_URL,

    'SECRET_KEY' : process.env.SECRET_KEY,

    'WHITE_LIST_IP' : process.env.WHITE_LIST_IP.split(' '),

    'MAIL_HOST' : process.env.MAIL_HOST,

    'MAIL_PORT' : process.env.MAIL_PORT,

    'MAIL_ID' : process.env.MAIL_ID,

    'MAIL_USERNAME' : process.env.MAIL_USERNAME,

    'MAIL_PASSWORD' : process.env.MAIL_PASSWORD
}