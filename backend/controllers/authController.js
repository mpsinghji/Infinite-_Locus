import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async(req,res)=>{
    try {
      const {name,email,password,role} = req.body
      if(!name || !email || !password){
            return res.json({
                success:false,
                message:"Missing field"
            })
      }
      if(!validator.isEmail(email)){
            return res.json({
                success:false,
                message:"enter a valid email"
            })
      }
      // validating password
      if(password.length < 8){
            return res.json({
                success:false,
                message:"enter a strong password"
            })
      }
      //hashing password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      const userdata = {
            name,
            email,
            password:hashedPassword,
            role: role === 'organizer' ? 'organizer' : 'user'
      }
      const newUser = new userModel(userdata)
      const user = await newUser.save();
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
      return res.json({
            success:true,
            token
      })
    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:error.message
        })
    }
}

export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.json({
                success:false,
                message:"missing credentials"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            return res.json({
                success:true,
                token
            })
        }else{
            return res.json({
                success:false,
                message:"wrong password"
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory blacklist for demonstration (not for production)
const tokenBlacklist = new Set();

export const logoutUser = async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
    tokenBlacklist.add(token);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Middleware to check if token is blacklisted
export const isTokenBlacklisted = (token) => tokenBlacklist.has(token);