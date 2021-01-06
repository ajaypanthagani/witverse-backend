/*importing required modules*/
const mongoose = require('mongoose');
const LocalMongoose = require('passport-local-mongoose');

/*declaring a Schema variable*/
const Schema = mongoose.Schema;

/*Defining a Schema for User*/
const User = new Schema({

    email : {

        type : String,
        required : true
    },
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


/*function to follow the User*/
User.methods.follow = function(id){

    if( this.following.indexOf(id) === -1 ){

        this.following.push(id);

    }

    return this.save();
}


/*function to unfollow the User*/
User.methods.unfollow = function(id){

    this.following.remove(id);

    return this.save();
}


/*Check if the user is following some other user*/
User.methods.isFollowing = function(id){

    return this.following.some(function(followId){

        return followId.toString() === id.toString();

    });
}


/*function to add follower*/
User.methods.addFollower = function(id){

    if( this.followers.indexOf(id) === -1 ){

        this.followers.push(id);

    }

    return this.save();

}

/* function to remove a follower*/
User.methods.removeFollower = function(id){

    this.followers.remove(id);

    return this.save();
}

/* function to add a quote to saved array*/
User.methods.saveQuote = function(id){

    if( this.saved.indexOf(id) === -1 ){

        this.saved.push(id);

    }

    return this.save();

}

/* function to remove a quote from saved array*/
User.methods.unsaveQuote = function(id){

    this.saved.remove(id);

    return this.save();
}

/* function to check if the quote is already saved or not*/
User.methods.isSaved = function(id){

    return this.saved.some(function(savedId){

        return savedId.toString() === id.toString();

    });
}

/*function to check if the user id is same as the id of the current user*/
User.methods.isMe = function(userId){

    return this._id.equals(userId);
}

/*applying LocalMongoose plugin to User schema*/
User.plugin(LocalMongoose);

/*creating index for all the String fields for search using wildcard specifier*/
User.index({'$**': 'text'});

/*creating a model with the defined Schema*/
const userModel = mongoose.model('User', User);

module.exports = userModel;