const userModel = require("../model/user_model");
const groupModel = require("../model/group_model");
const friendModel = require("../model/friend_model");
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
    var result = await userModel.updateOne(
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
    console.log("targetId: ", targetId);
    const user = await userModel.findOne({
      _id: sourceId,
    });
    if (user) {
      const filteredMessages = user.messages.filter(
        (message) => message.targetId === targetId
      );
      // console.log("Filtered Messages:", filteredMessages);
      return filteredMessages;
    } else {
      console.log("User not found");
    }
  }

  static async addGroupMessage(
    message,
    userId,
    senderName,
    time,
    groupId,
    src_path,
    dest_path
  ) {
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

  static async getAllUserFriends(sourceId) {
    const friends = await friendModel.find({ userId: sourceId, isFriend: true }, "friendId");
    if (friends.length > 0) {
      const friendIds = friends.map((friend) => friend.friendId);
      const users = await userModel.find({ _id: { $in: friendIds }}, "_id name");
      return users;
    } else {
      console.log("No friends found.");
    }
  }

  static async addPeopleYouMayKnownProple(
    sourceId,
    targetId,
    userName,
    friendName
  ) {
    console.log("sourceId: ", sourceId);
    console.log("targetId: ", targetId);
    const existingFriend = await friendModel.findOne({
      userId: sourceId,
      friendId: targetId,
    });
    if (!existingFriend) {
      try {
        const newFriend = new friendModel({
          userId: sourceId,
          friendId: targetId,
          friendName: friendName,
          userName: userName,
          isFriend: false,
          isFriendRequestSent: false,
          isFriendRequestRecieved: false,
        });
        await newFriend.save();
      } catch (error) {
        console.error("Error saving friend:", error);
        throw error;
      }
    } else {
      console.log("Friend already exists!");
    }
  }

  static async PeopleYouMayKnown(sourceId) {
    try {
      console.log(sourceId);
      const friends = await friendModel.find({
        userId: sourceId,
        isFriend: false,
      });
      return friends;
    } catch (error) {
      console.log(error);
    }
  }

  static async updatePeopleYouMayKnow(userId, friendId, requestSent) {
    try {
      var friends = await friendModel.updateOne(
        { userId: userId, friendId: friendId },
        {
          $set: {
            isFriendRequestSent: requestSent,
          },
        }
      );
      friends = await friendModel.updateOne(
        { userId: friendId, friendId: userId },
        {
          $set: {
            isFriendRequestRecieved: requestSent,
          },
        }
      );
      return friends;
    } catch (error) {
      console.log(error);
    }
  }

  static async addFriend(
    userId,
    friendId,
    isFriend,
    isFriendRequestSent,
    isFriendRequestRecieved
  ) {
    try {
      var friends = await friendModel.updateOne(
        { userId: userId, friendId: friendId },
        {
          $set: {
            isFriend: isFriend,
            isFriendRequestSent: isFriendRequestSent,
            isFriendRequestRecieved: isFriendRequestRecieved,
          },
        }
      );
      friends = await friendModel.updateOne(
        { userId: friendId, friendId: userId },
        {
          $set: {
            isFriend: isFriend,
            isFriendRequestSent: isFriendRequestSent,
            isFriendRequestRecieved: isFriendRequestRecieved,
          },
        }
      );
      return friends;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserService;
