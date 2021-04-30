const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,  
        unique: true,
    },
    age: {
        type: Number,
        require: true,
    },
    phone:{
        type: Number,
        require: true,
    },
    mbti: {
        type: String,
        required: true,
    },
    friendList:{
        type: ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('User', userSchema);