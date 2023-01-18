const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    username:String,
    email:String,
    pass:String,
    age:Number
})

const UserModel = mongoose.model("user",userSchema)

module.exports = {UserModel}