const userModel = require('../model/user_model');
const jwt = require('jsonwebtoken');

class UserService {
    static async registerUser(name, email, password, phone_no, latitude, longitude) {
        try {
            const createUser = new userModel({ name, email, password, phone_no, latitude, longitude });
            return await createUser.save();
        }
        catch (err) {
            console.error(err);
            console.log('User services error:');
            throw err;
        }
    }
    static async checkuser(email) {
        try {
            return await userModel.findOne({ email });
        }
        catch (error) {
            throw error;
        }
    }
    static async generateToken(tokenData, secretKey, jwt_expire) {
        return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
    }
    static async updateLocation(userEmail, newLatitude, newLongitude) {
        userModel.findOneAndUpdate(
            { email: userEmail }, // Find the user by email
            { latitude: newLatitude, longitude: newLongitude }, // Update the latitude and longitude
            { new: true }, // Return the updated document
        ).then((updatedUser) => console.log('User updated successfully:', updatedUser))
            .catch(
                (err) => {
                    console.error('Error updating user:', err);
                    return;
                }
            );
    }
}

module.exports = UserService;