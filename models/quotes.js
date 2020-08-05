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

Comment.methods.like = function(userId){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return this.save();
}

Comment.methods.unlike = function(userId){

    this.likes.remove(userId);

    return this.save();
}

Comment.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

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

Quote.methods.like = function(userId){

    if( this.likes.indexOf(userId) === -1 ){

        this.likes.push(userId);

    }

    return this.save();
}

Quote.methods.unlike = function(userId){

    this.likes.remove(userId);

    return this.save();
}

Quote.methods.isLiked = function(userId){

    return this.likes.some(function(followId){

        return followId.toString() === userId.toString();

    });
}

const quoteModel = mongoose.model('Quote', Quote);

module.exports = quoteModel;