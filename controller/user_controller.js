const { response } = require("express");
const UserService = require("../services/user_services");
const mongoose = require("mongoose");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone_no, latitude, longitude, tagArray } =
      req.body;
    const successRes = await UserService.registerUser(
      name,
      email,
      password,
      phone_no,
      latitude,
      longitude,
      tagArray
    );
    res.json({ status: true, successs: "User successfully registered." });
  } catch (err) {
    console.log("User registration unsuccessful.");
    throw err;
  }
};

exports.login = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await UserService.checkuser(email);
    // console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch === false) {
      throw new Error("Invalid password");
    }

    // let tokenData = {
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   phone_no: user.phone_no,
    //   latitude: user.latitude,
    //   longitude: user.longitude,
    // };
    // const token = await UserService.generateToken(tokenData, "secretKey", "1h");
    res.status(200).json({
      status: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_no: user.phone_no,
      tags: user.tagArray
    });
  } catch (err) {
    console.log(err);
  }
};

exports.locationUpdate = async (req, res, next) => {
  try {
    const { email, latitude, longitude } = req.body;
    // console.log(latitude, longitude);
    const UpdateLocation = await UserService.updateLocation(
      email,
      latitude,
      longitude
    );
    console.log("Updated location successfully");
    res.json({ msg: "hello" });
  } catch (err) {
    console.log(err);
    ``;
    console.log("failed to update location");
  }
};

exports.tagUpdate = async (req, res, next) => {
  try {
    const { email, tagArray } = req.body;
    const UpdateTag = await UserService.updateTag(email, tagArray);
    console.log("Updated location successfully");
    res.json({ msg: "hello" });
  } catch (err) {
    console.log(err);
    ``;
    console.log("failed to update location");
  }
};

exports.nearbyUsers = async (req, res) => {
  try {
    const { email, latitude, longitude } = req.body;
    users = await UserService.findNearbyUsers(email, latitude, longitude);
    res.json({users});
  } catch (err) {
    console.log(err);
  }
};

exports.sentMessage = async (req, res) => {
  const {message , sourceId, targetId, type, time, src_path, dest_path} = req.body;
  try {
    msg = await UserService.addMessage(message , sourceId, targetId, type, time, src_path, dest_path);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.sentGroupMessage = async (req, res) => {
  const {message, userId, senderName, groupId, time,src_path, dest_path} = req.body;
  try {
    msg = await UserService.addGroupMessage(message, userId, senderName, time, groupId, src_path, dest_path);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.oldMessage = async (req, res) => {
  const {sourceId, targetId} = req.body;
  try{
    msg = await UserService.findMessagesByTargetId(sourceId, targetId);
    console.log(msg);
    res.status(200).json({msg: msg});
  }
  catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.oldGroupMessage = async (req, res) => {
  const {groupId} = req.body;
  try{
    msg = await UserService.findGroupMessagesByTargetId(groupId);
    res.status(200).json({msg: msg});
  }
  catch(error){
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.addImage = async (req, res) =>{
  try{
    res.json({path:req.file.filename});
  }
  catch(error){
    return res.json({error: error});
  }
}

exports.addPeopleYouMayKnownProple = async (req, res) =>{
  const {sourceId, targetId, userName, friendName} = req.body;
  try{
    console.log(sourceId);
    await UserService.addPeopleYouMayKnownProple(sourceId, targetId, userName, friendName);
    await UserService.addPeopleYouMayKnownProple(targetId, sourceId, friendName, userName);
    res.status(200).json({msg:{}});
  }
  catch(error){
    return res.json({error:error});
  }
}

exports.updatePeopleYouMayKnow = async (req, res) =>{
  const {userId, friendId, requestSent} = req.body;
  try{
    const mayKnow = await UserService.updatePeopleYouMayKnow(userId,friendId, requestSent);
    res.status(200).json(mayKnow);
  }
  catch(error){
    return res.json({error:error});
  }
}

exports.addFriend = async (req, res) =>{
  const {userId, friendId, isFriend, isFriendRequestSent, isFriendRequestRecieved} = req.body;

  try{
    const mayKnow = await UserService.addFriend(userId,friendId, isFriend, isFriendRequestSent, isFriendRequestRecieved);
    res.status(200).json(mayKnow);
  }
  catch(error){
    return res.json({error:error});
  }
}

exports.PeopleYouMayKnown = async (req, res) =>{
  const {sourceId} = req.body;
  try{
    const mayKnow = await UserService.PeopleYouMayKnown(sourceId);
    res.status(200).json(mayKnow);
  }
  catch(error){
    return res.json({error:error});
  }
}

exports.findFriend = async (req, res) => {
  const {sourceId} = req.body;
  try{
    console.log(sourceId);
    friends = await UserService.getAllUserFriends(sourceId);
    return res.json({friends:friends});
  }
  catch(err){
    return res.json({error:err});
  }
}

exports.userupdate = async (req, res, next) => {}; 

