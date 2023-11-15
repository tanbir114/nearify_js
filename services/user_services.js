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
            type: 'Point',
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
    userModel
      .findOneAndUpdate(
        { email: userEmail }, // Find the user by email
        { latitude: newLatitude, longitude: newLongitude }, // Update the latitude and longitude
        { new: true } // Return the updated document
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
      .findOneAndUpdate(
        { email: email }, // Find the user by email
        { tagArray: tagArray }, // Update the latitude and longitude
        { new: true } // Return the updated document
      )
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
    // userModel.collection.createIndex({
    //   "city.location.coordinates": "Point",
    // });
//     return await userModel.create({location: [longitude, latitude] }).
//   then(() => City.findOne().where('location').within(colorado)).
//   then(doc => assert.equal(doc.name, 'Denver'));
  
    // const centerCoordinates = [longitude, latitude];
    // const maxDistance = 0.014; // Approximately 1 kilometer
    // await userModel
    //   .find({
    //     "city.location.coordinates": {
    //       $near: {
    //         $geometry: {
    //           type: "Point",
    //           coordinates: centerCoordinates,
    //         },
    //         $maxDistance: maxDistance,
    //       },
    //     },
    //   })
    //   .then((nearbyUsers) => {
    //     console.log("Nearby users:", nearbyUsers);
    //     return nearbyUsers;
    //   })
    //   .catch((err) => console.error("thik nai", err));


    const nearby = await userModel.find(
        {
          location:
            { $near :
               {
                 $geometry: { type: "Point",  coordinates: [longitude, latitude] },
                 $maxDistance: 0
               }
            }
        }
    )
    return nearby;
  }
}

module.exports = UserService;
