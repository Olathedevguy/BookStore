const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt')
const UserSchema =  new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter an Email to proceed'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please a valid Email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter an password to proceed'],
        minlength: [6, 'Password must not be less than 6']
    }
})

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash
    next()
})

UserSchema.post('save', function(doc, next){
    console.log('user created!', doc)
    next()
})  

UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}


const User = mongoose.model('user', UserSchema);
module.exports = User;