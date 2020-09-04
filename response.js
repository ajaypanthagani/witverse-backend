//wrapper for different types of responses

exports.wrapUser = (requestedUser, requestingUser) => {

    return {

        _id : requestedUser._id,
        username : requestedUser.username,
        firstname : requestedUser.firstname,
        lastname : requestedUser.lastname,
        displayImage : requestedUser.displayImage,
        following : requestedUser.following,
        followers : requestedUser.followers,
        createdAt : requestedUser.createdAt,
        updatedAt : requestedUser.updatedAt,
        isFollowed : requestingUser.isFollowing(requestedUser._id),
        isMe : requestedUser.isMe(requestingUser._id)
    };
}

exports.wrapQuote = (requestedQuote, requestingUser) => {

    return {

        _id : requestedQuote._id,
        text : requestedQuote.text,
        tags : requestedQuote.tags,
        emotion : requestedQuote.emotion,
        author : requestedQuote.author,
        likes : requestedQuote.likes,
        comments : requestedQuote.comments,
        isLiked : requestedQuote.isLiked(requestingUser._id),
        isSaved : requestingUser.isSaved(requestedQuote._id),
        isOwned : requestedQuote.isOwned(requestingUser._id)
    };
}

exports.wrapComment = (requestedComment, requestingUser) => {

    return {

        _id : requestedComment._id,
        text : requestedComment.text,
        author : requestedComment.author,
        likes : requestedComment.likes,
        isLiked : requestedComment.isLiked(requestingUser._id),
        isOwned : requestedComment.isOwned(requestingUser._id)
    };
}