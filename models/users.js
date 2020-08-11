const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalMongoose = require('passport-local-mongoose');


const User = new Schema({

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


//follow method for User
User.methods.follow = function(id){

    if( this.following.indexOf(id) === -1 ){

        this.following.push(id);

    }

    return this.save();
}


//unfollow method for user
User.methods.unfollow = function(id){

    this.following.remove(id);

    return this.save();
}


//check if the user is already followed or not
User.methods.isFollowing = function(id){

    return this.following.some(function(followId){

        return followId.toString() === id.toString();

    });
}


//method to add a follower
User.methods.addFollower = function(id){

    if( this.followers.indexOf(id) === -1 ){

        this.followers.push(id);

    }

    return this.save();

}

//method to remove a follower
User.methods.removeFollower = function(id){

    this.followers.remove(id);

    return this.save();
}

//method to add a quote to saved array
User.methods.saveQuote = function(id){

    if( this.saved.indexOf(id) === -1 ){

        this.saved.push(id);

    }

    return this.save();

}

//method to remove a quote from saved array
User.methods.unsaveQuote = function(id){

    this.saved.remove(id);

    return this.save();
}

//method to check if the quote is already saved or not
User.methods.isSaved = function(id){

    return this.saved.some(function(savedId){

        return savedId.toString() === id.toString();

    });
}

User.plugin(LocalMongoose);

User.index({'$**': 'text'});

const userModel = mongoose.model('User', User);

module.exports = userModel;