const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalMongoose = require('passport-local-mongoose');


const users = new Schema({

    firstname : {

        type : String,
        required : true
    },

    lastname : {

        type : String,
        required : true
    },

    displayImage : {

        type: String,
        default : '/images/profile/default.png'
    },

    admin : {

        type : Boolean,
        default : false
    }
},
{
    timestamps : true
});

users.plugin(LocalMongoose);

const userModel = mongoose.model('User', users);

module.exports = userModel;