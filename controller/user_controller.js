const { response } = require("express");
const UserService = require("../services/user_services");
const mongoose = require("mongoose");

exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
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
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await UserService.checkuser(email);
    console.log(user);
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
      latitude: user.latitude,
      longitude: user.longitude,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.locationUpdate = async (req, res, next) => {
  try {
    const { email, latitude, longitude } = req.body;
    console.log(latitude, longitude);
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
    const { latitude, longitude } = req.body;
    users = await UserService.findNearbyUsers(latitude, longitude);
    console.log("aaaaaaaaaa");
    console.log("Vodar Users: ", users);
    // res.json("ok",users);
    res.json({users});
  } catch (err) {
    console.log("ok re", err);
  }
};

exports.userupdate = async (req, res, next) => {};
