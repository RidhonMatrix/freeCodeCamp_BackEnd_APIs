const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String
});

const exerciseSchema = new mongoose.Schema({
    userId : String,
    userName: String,
    description : String,
    duration : Number,
    date : Date
});


const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = { User, Exercise };