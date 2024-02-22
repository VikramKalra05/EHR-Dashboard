const { UserModel } = require("../models/userModel");
const { BlacklistModel } = require("../models/blacklistModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();

const registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const isUser = await UserModel.findOne({email});
        if(isUser){
            res.status(200).send({"msg": "User already exists"});
        }else{
            bcrypt.hash(password, 8, async (err, hash) => {
                if(err){
                    res.status(200).send({"err": "Something went wrong while hashing"});
                }else{
                    const user = new UserModel({email, password: hash, role});
                    await user.save();
                    res.status(200).send({"msg": "User registered successfuly", "user": user});
                }
            })
        }
    } catch (error) {
        res.status(400).send({"err": error})
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (err, hash) => {
                if(hash){
                    const token = jwt.sign({user: user}, process.env.secretKey , { expiresIn: "5hr"});
                    res.status(200).send({
                        "msg": "Login successful",
                        "token": token
                    });
                }else{
                    res.status(200).send({"msg": "Wrong Password"});
                }
            })
        }else{
            res.status(200).send({"msg": "No user found"});
        }
    } catch (error) {
        res.status(400).send({"err": error})
    }
}

const logoutUser = async (req, res) => {
    const token = req.headers.authorization;
    try {
        if(token){
            const blacklist = new BlacklistModel({token});
            await blacklist.save();
            res.status(200).send({"msg": "User has been logged out", success: true});
        }else{
            res.status(400).send({"err": "Give a token to logout"});
        }
    } catch (error) {
        res.status(400).send({"err": error})
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}