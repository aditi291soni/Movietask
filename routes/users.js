const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost/movie")

const plm = require("passport-local-mongoose")
const userSchema=mongoose.Schema({
  image:String,
  description:String,
  heading:String,
  username:String,
  password:String

})
userSchema.plugin(plm)
module.exports=mongoose.model("user",userSchema)