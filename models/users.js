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
    },

    following : [{

        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    followers : [{

        type: Schema.Types.ObjectId,
        ref : 'User'
    }],

    saved : [{

        type: Schema.Types.ObjectId,
        ref : 'Quote'
    }]
},
{
    timestamps : true
});

users.methods.follow = function(id){

    if( this.following.indexOf(id) === -1 ){

        this.following.push(id);

    }

    return this.save();
}

users.methods.unfollow = function(id){

    this.following.remove(id);

    return this.save();
}

users.methods.isFollowing = function(id){

    return this.following.some(function(followId){

        return followId.toString() === id.toString();

    });
}

users.methods.addFollower = function(id){

    if( this.followers.indexOf(id) === -1 ){

        this.followers.push(id);

    }

    return this.save();

}

users.methods.removeFollower = function(id){

    this.followers.remove(id);

    return this.save();
}

users.methods.saveQuote = function(id){

    if( this.saved.indexOf(id) === -1 ){

        this.saved.push(id);

    }

    return this.save();

}

users.methods.unsaveQuote = function(id){

    this.saved.remove(id);

    return this.save();
}

users.methods.isSaved = function(id){

    return this.saved.some(function(savedId){

        return savedId.toString() === id.toString();

    });
}

users.plugin(LocalMongoose);

const userModel = mongoose.model('User', users);

module.exports = userModel;