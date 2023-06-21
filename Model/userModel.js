const {Schema,model} = require('mongoose')

const jwt = require('jsonwebtoken')

const userSchema = Schema({
    number :{
        type : String,
        required : true
    },
    email : String,
    password : String
    }
    ,{timestamps : true})


userSchema.methods.generateJWT = function (){
    const token = jwt.sign({
        _id : this._id,
        number : this.number,
        email : this.emailm,
        password : this.password
    } , process.env.JWT_SECRET_KEY,
    {expiresIn : "7d"});
     
    return token
}

module.exports.User = model("User", userSchema);