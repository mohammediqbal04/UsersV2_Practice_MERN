const express = require('express');
const adminDb = require('../models/adminModel');
const jwt = require('jsonwebtoken');

const secretKey = "maticzSecretKey";

const router = express.Router();

//Register Admin

const register = async(req, res) => {
  console.log('req.body------', req.body);

  const { adminname, email, password } = req.body;
  try{
    const adminregister = new adminDb({ adminname, email, password });
    await adminregister.save();
    console.log(adminregister);
    res.status(200).json({message: "registration successfull", status: true});
  } catch(err){
    console.log('wwwwwwww----------', err );
    
    res.status(500).json({message: "registration failed----", err, status: false});
  }
};

//Login Admin

const login = async(req, res) => {
  console.log('req.body------', req.body);

  const { email, password } = req.body;
  try{
    const adminlogin = await adminDb.findOne({ email });
    console.log("adminlogin------",adminlogin)

    if(!adminlogin){
      return res.status(400).json({message: "admin not found"});
    } else if (adminlogin.password !== password){
      return res.status(400).json({message: "incorrect password"});
    } 

    var token = jwt.sign({ id: adminlogin._id, email: adminlogin.email } , secretKey,
    { expiresIn: "1h" }) //ask about refresh token to jegan bro 
    console.log("token------", token);

    if(token){
     return res.status(200).json({message: "login successful", adminlogin, token})
    } else{
      console.log("token------ couldnt get token" )
    }
  } catch(err){
    return res.status(500).json({message: "login failed-----", err});
  }
}

module.exports = { register, login };