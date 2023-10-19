const UserService = require('../services/user_services');
const mongoose = require('mongoose');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone_no, latitude,longitude } = req.body;
        const successRes = await UserService.registerUser(name, email, password, phone_no, latitude, longitude);
        res.json({ status: true, successs: "User successfully registered." });
    }
    catch (err) {
        console.log('User registration unsuccessful.');
        throw err;
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await UserService.checkuser(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch === false) {
            console.log('aaaaaaaaaaaaa');
            throw new Error('Invalid password');
        }

        let tokenData = { _id: user._id, name: user.name, email: user.email, phone_no: user.phone_no, latitude: user.latitude, longitude: user.longitude };

        const token = await UserService.generateToken(tokenData, "secretKey", '1h');

        res.status(200).json({ status: true, token: token });
    }
    catch (err) {
        console.log('Login unsuccessful');
        // throw err;
    }
}

exports.locationUpdate = async(req, res, next) => {
    try{
        const {email,latitude, longitude} = req.body;
        const UpdateLocation = await UserService.updateLocation(email, latitude, longitude);
        console.log('Updated location successfully');
    }
    catch (err){
        console.log(err);``
        console.log('failed to update location');
    }
}