const userModel = require("../model/user_model");
const groupModel = require("../model/group_model");
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
      .then((updatedUser) => console.log("User updated successfully"))
      .catch((err) => {
        console.error("Error updating user:", err);
        return;
      });
  }
  static async updateTag(email, tagArray) {
    await userModel
      .findOneAndUpdate({ email: email }, { tagArray: tagArray }, { new: true })
      .then((updatedUser) => {
        console.log("User updated successfully");
        return updatedUser;
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        return;
      });
  }
  static async findNearbyUsers(userEmail, latitude, longitude) {
    const nearby = await userModel.find({
      email: { $ne: userEmail },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 1000,
        },
      },
    });
    return nearby;
  }
  static async addMessage(
    message,
    sourceId,
    targetId,
    type,
    time,
    src_path,
    dest_path
  ) {
    const result = await userModel.updateOne(
      { _id: sourceId },
      {
        $push: {
          messages: {
            targetId: targetId,
            type: type,
            message: message,
            time: time,
            path: src_path,
          },
        },
      }
    );
    result = await userModel.updateOne(
      { _id: targetId },
      {
        $push: {
          messages: {
            targetId: sourceId,
            type: "destination",
            message: message,
            time: time,
            path: dest_path,
          },
        },
      }
    );
    return result;
  }

  static async findMessagesByTargetId(sourceId, targetId) {
    const user = await userModel.findOne({
      _id: sourceId,
      "messages.targetId": targetId,
    });
    return user;
  }

  static async addGroupMessage(message, userId, senderName, time, groupId, src_path, dest_path) {
    try {
      const createMessage = new groupModel({
        userId: userId,
        message: message,
        time: time,
        groupId: groupId,
        src_path: src_path,
        dest_path: dest_path,
        senderName: senderName,
      });
      console.log(createMessage);
      return await createMessage.save();
    } catch (err) {
      console.error(err);
      console.log("Group Message save error");
      throw err;
    }
  }

  static async findGroupMessagesByTargetId(groupId) {
    const user = await groupModel.find({
      groupId: groupId,
    });
    console.log(user);
    return user;
  }
}

module.exports = UserService;
