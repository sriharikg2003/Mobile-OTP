const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const { User } = require("../Model/userModel");
const { Otp } = require("../Model/otpModel");

// Add your Twilio credentials here
const accountSid = process.env.ACC_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber =process.env.TWILIO_PHONE_NUMBER;

// Function to send OTP via SMS using Twilio API
async function sendOTPviaSMS(number, otp) {
  const client = require('twilio')(accountSid, authToken);
  
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: number
    });
  } catch (error) {
    throw new Error('Failed to send OTP via SMS');
  }
}

module.exports.signUp = async (req, res) => {
  console.log(req.body)
  const user = await User.findOne({
    number: req.body.number,
    email : req.body.email,
    password : req.body.password
  });

  if (user) return res.status(400).send("User already exists");

  const OTP = otpGenerator.generate(6, {
    digits: true
  });

  const number = req.body.number;



  const otp = new Otp({
    number: number,
    otp: OTP
  });

  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();

  try {
    console.log(number,OTP);
    await sendOTPviaSMS(number, OTP);
    return res.status(200).render("index",{number:number , isotp : true,email :req.body.email,password : req.body.password});
  } catch (error) {
    console.log(number,OTP)
    return res.status(500).send("Failed to send OTP");
  }
};

module.exports.verifyOtp = async (req, res) => {

  const otpHolder = await Otp.find({
    number: req.body.number
  });

  console.log(req.body)
  if (otpHolder.length === 0) return res.status(400).send("You used an expired OTP");

  const righOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, righOtpFind.otp);

  if (righOtpFind.number === req.body.number && validUser) {
    const user = new User(_.pick(req.body, ['number','email','password']));
    const token = user.generateJWT();
    const result = await user.save();
    const OTPDelete = await Otp.deleteMany({
      number: righOtpFind.number
    });

 

    return res.status(200).render("success");
  } else {
    return res.status(400).send("Wrong OTP");
  }
};
