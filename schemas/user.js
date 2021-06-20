const mongoose = require('mongoose');
const { renderString } = require('nunjucks');

const { Schema } = mongoose;
const userSchema = new Schema({
    id: {
        type: String,
        unique: true,
    },
    name: String,
    pwd: String,
    selfIntro:String,
    profileUrl:String,
    friendList:[
        {
            friendID: String,
            friendName:String,
            "_id": false
        }
    ],
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);