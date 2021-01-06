/*import required modules*/
const mongoose = require('mongoose');

/*declaring a schema variable*/
const Schema = mongoose.Schema;

/*Defining schema for Comment*/
const Comment = new Schema({

    text : {

        type : String,
        required : true
    },

    likes : [{

        type : Schema.Types.ObjectId,
        ref : 'User'
    }],

    author : {

        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
})

/*like function for Comment*/
Comment.methods.like = function(userId, parent){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return parent.save();
}

/*unlike function for Comment*/
Comment.methods.unlike = function(userId, parent){

    this.likes.remove(userId);

    return parent.save();
}

/*function to check if the Comment is already liked or not by a specific user*/
Comment.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

/*function to check if the Comment is authored by a specific user or not*/
Comment.methods.isOwned = function(userId){

    return this.author.equals(userId);
}

/*Defining Schema for Quote*/
const Quote = new Schema({

    text : {

        type: String,
        required: true
    },

    tags : [String],

    emotion : {

        type : String,
        default : 'neutral'
    },

    author : {

        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    likes : [{

        type : Schema.Types.ObjectId,
        ref : 'User'
    }],

    comments : [Comment]
});

/*like function for Quote*/
Quote.methods.like = function(userId){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return this.save();
}

/*unlike function for Quote*/
Quote.methods.unlike = function(userId){

    this.likes.remove(userId);

    return this.save();
}


/*function to check if the Quote is already liked or not by a specific user*/
Quote.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

/*function to check if the Comment is authored by a specific user*/
Quote.methods.isOwned = function(userId){

    return this.author._id.toString() === userId.toString();
}

/*creating index for all the String type fields for searching using wildcard specifier*/
Quote.index({'$**': 'text'});

/*creating a model with the defined schema*/
const quoteModel = mongoose.model('Quote', Quote);

/*exporting the model*/
module.exports = quoteModel;