const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

//like method for commment
Comment.methods.like = function(userId, parent){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return parent.save();
}

//unlike method for comment
Comment.methods.unlike = function(userId, parent){

    this.likes.remove(userId);

    return parent.save();
}

//method to check if the comment is already liked or not
Comment.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

//quote schema
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

//like method for quote
Quote.methods.like = function(userId){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return this.save();
}

//unlike method for quote
Quote.methods.unlike = function(userId){

    this.likes.remove(userId);

    return this.save();
}


//method to check if the quote is already liked or not
Quote.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

const quoteModel = mongoose.model('Quote', Quote);

module.exports = quoteModel;