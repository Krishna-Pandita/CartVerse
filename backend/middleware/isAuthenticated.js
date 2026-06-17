// import { JsonWebTokenError } from "jsonwebtoken";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";


export const isAuthenticated = async(req,res,next) =>{
  try {
    const authHeader = req.headers.authorization;
 if(!authHeader || !authHeader.startsWith("Bearer ")){
  return res.status(400).json({
    success:false,
    message:"Authorization Token is missing or invalid"
  })
 }

 const Token = authHeader.split(" ")[1];
let decoded;
try {
  decoded = jwt.verify(Token, process.env.SECRET_KEY);
  console.log("DECODED:", decoded);
} catch (error) {

  console.log("JWT ERROR:", error.message);
  console.log("TOKEN:", Token);
  console.log("SECRET_KEY:", process.env.SECRET_KEY);

  if (error.name === "TokenExpiredError") {
    return res.status(400).json({
      success: false,
      message: "Token has expired"
    });
  }

  return res.status(400).json({
    success: false,
    message: "Access Token is missing or invalid"
  });
}
console.log("USER ID FROM TOKEN:", decoded.id);

const user = await User.findById(decoded.id);

if(!user){
  return res.status(400).json({
    success:false,
    message:"User not found"
  })
}

req.user = user;
req.id = user.id;
next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export const isAdmin = async(req,res,next) =>{
 if(req.user && req.user.role === "admin"){
  next();
 }else{
  return res.status(403).json({
    message:"Access denied. Admins only."
  })
 }
}