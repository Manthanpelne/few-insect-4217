const express = require("express");
const {HotelModel} = require("../models/hotelmodel")
const hotelrouter = express.Router()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


hotelrouter.get("/",async(req,res)=>{
  let q = req.query
  try {
      const hotel = await HotelModel.find(q)
      res.send(hotel)
  } catch (error) {
      console.log(error)
      res.send("somthing went wrong")
  }
})

hotelrouter.get("/get", async (req, res) => {
    try {
      const q = req.query.q||"";
    let sort = req.query.sort||"price"||"rating";


    req.query.sort?(sort=req.query.sort.split(",")):(sort=[sort]);

    let sortBy = {}
    if(sort[1]){
       sortBy[sort[0]]=sort[1];
    }else{
       sortBy[sort[0]]="asc"
    }

    const hotel = await HotelModel.find({name:{$regex:q , $options:"i"}})
    .sort(sortBy)

      res.send(hotel)
      console.log("here is your data");
    } catch (error) {
      console.log(error);
    }
  });


  
  hotelrouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
      const note = new HotelModel(payload);
      await note.save();
      res.send(note);
      console.log("created new hotel data");
    } catch (error) {
      res.send(error);
      console.log("somthing is wrong");
    }
  });
  
  hotelrouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const note = await HotelModel.findOne({ _id: id });
    const noteuserId = note.userID;
    const userid_makingReq = req.body.userID;
    try {
      if (userid_makingReq !== noteuserId) {
        res.status(400).send("You are not authorized!");
      } else {
        const note = await HotelModel.findByIdAndUpdate({ _id: id }, payload);
        res.send(note);
        console.log("updated the details");
      }
    } catch (error) {
      res.send(error);
      console.log({ err: "somthing is wrong" });
    }
  });
  
  hotelrouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await HotelModel.findOne({ _id: id });
    const noteuserId = note.userID;
    const userid_makingReq = req.body.userID;
    try {
      if (userid_makingReq !== noteuserId) {
        res.status(400).send("You are not authorized!");
      } else {
        const note = await HotelModel.findByIdAndDelete({ _id: id });
        res.send(note);
        console.log("deleted the details");
      }
    } catch (error) {
      res.send(error);
      console.log({ err: "somthing is wrong" });
    }
  });
  
  module.exports = { hotelrouter };