const userModel = require("../model/user_model");
const jwt = require("jsonwebtoken");

class UserService {
  static async registerUser(
    name,
    email,
    password,
    phone_no,
    latitude,
    longitude,
    tagArray
  ) {
    try {
      const createUser = new userModel({
        name,
        email,
        password,
        phone_no,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        tagArray,
      });
      return await createUser.save();
    } catch (err) {
      console.error(err);
      console.log("User services error:");
      throw err;
    }
  }
  static async checkuser(email) {
    try {
      return await userModel.findOne({ email: email });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  static async generateToken(tokenData, secretKey, jwt_expire) {
    return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
  }
  static async updateLocation(userEmail, newLatitude, newLongitude) {
    console.log(newLatitude, newLongitude);
    console.log(userEmail);
    userModel
      .findOneAndUpdate(
        { email: userEmail },
        {
          location: {
            type: "Point",
            coordinates: [newLongitude, newLatitude],
          },
        },
        { new: true }
      )
      .then((updatedUser) =>
        console.log("User updated successfully:", updatedUser)
      )
      .catch((err) => {
        console.error("Error updating user:", err);
        return;
      });
  }
  static async updateTag(email, tagArray) {
    await userModel
      .findOneAndUpdate({ email: email }, { tagArray: tagArray }, { new: true })
      .then((updatedUser) => {
        console.log("User updated successfully:", updatedUser);
        return updatedUser;
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        return;
      });
  }
  static async findNearbyUsers(latitude, longitude) {
    console.log(latitude, longitude);
    const nearby = await userModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 1000,
        },
      },
    });
    console.log(nearby);
    return nearby;
  }
}

module.exports = UserService;
