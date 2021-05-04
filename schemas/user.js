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
    friendList:[new mongoose.Schema({friendId: String, name:String})],
},{
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);