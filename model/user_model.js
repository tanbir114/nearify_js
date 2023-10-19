const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema =mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    phone_no:{
        type: String,
        required: false,
    },
    latitude:{
        type: Number,
        required: false,
    },
    longitude:{
        type: Number,
        required: false,
    }
})

userSchema.pre('save', async function(){
    try{
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password, salt);

        user.password = hashpass;
    }catch(err){
        throw err;
    }

})

userSchema.methods.comparePassword =async function(userPassword){
    try{
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch(error){
        throw error;
    }
}

module.exports = mongoose.model('user', userSchema);
