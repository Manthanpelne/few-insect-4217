const express = require("express");
const { UserModel } = require("../models/usermodel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

userRouter.get("/", async (req, res) => {
  try {
    let query = req.query;
    let user = await UserModel.find(query);
    res.send(user);
    console.log("user data");
  } catch (error) {
    console.log("somthing is wrong");
  }
});

userRouter.post("/register", async (req, res) => {
  const { username, email, pass, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, secured_pass) => {
      if (err) {
        res.send(err);
      } else {
        const user = new UserModel({
          username,
          email,
          pass: secured_pass,
          age,
        });
        await user.save();
        res.send({"msg":"Congrats registration successfull!!"});
      }
    });
  } catch (error) {
    res.status(400).send({"msg":"Error while registering!!"});
    console.log(error);
  }
});


userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body; 
  try {
    const user = await UserModel.find({email:email});
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          const token = jwt.sign({userID:user[0]._id}, process.env.key);
          res.send({ "msg": "login sucessfull", token: token });
        } else {
          res.status(400).send({"msg":"wrong credentials! Please try again"});
        }
      });
    } else {
      res.status(400).send({"msg":"User not found, Please register first!"});
    }
  } catch (error) {
    res.send(error);
  }
});

userRouter.get("/data", async (req, res) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, process.env.key, (err, decoded) => {
      if (err) {
        res.send(err);
      } else {
        res.send("data");
      }
    });
  } catch (error) {}
});

module.exports = { userRouter };