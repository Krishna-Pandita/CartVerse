import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPaswword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPaswword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    newUser.token = token;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("ERROR:", error); //
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if the header exists or starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    // 2. Extract the token from the header
    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      // 3. Verify the token using your secret key
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The Registered token has expired",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Token Verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email Verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exists",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified, Please verify your Email",
      });
    }

    //generate token

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    existingUser.isLoggedIn = true;
    await existingUser.save();


    const existingSession = await Session.findOne({userId: existingUser._id});
    if(existingSession){
      await Session.deleteOne({userId:existingUser._id});
    }


    await Session.create({userId: existingUser._id});
    return res.status(200).json({
      success:true,
      message:`Welcome Back ${existingUser.firstName}`,
      user:existingUser,
      accessToken,
      refreshToken
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async(req,res) =>{
  try {
    const userId = req.id;
    await Session.deleteOne({userId})
    await User.findByIdAndUpdate(userId,{isLoggedIn:false})
    return res.status(200).json({
      success:true,
      message:"User Logged out Successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const forgotPassword = async(req,res)=>{
  try {
    const {email} = req.body;
    const user= await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    const otp = Math.floor(100000 + Math.random() *900000).toString();
    const otpExpiry = Date.now() + 10*60*1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;


    await user.save();
    await sendOTPMail(email,otp);
    return res.status(200).json({
      success:true,
      message:"OTP sent to your email successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const verifyOTP = async(req,res) =>{
  try {
    
    const{otp} = req.body;
   const email = req.params.email;
   
   if(!otp){
    return res.status(400).json({
      success:false,
      message:"OTP is required"
    })
   }

   const user = await User.findOne({ email });
   if(!user){
    return res.status(400).json({
      success:false,
      message:"User not found"
    })
   }

   if(!user.otp || !user.otpExpiry){
    return res.status(400).json({
      success:false,
      message:"OTP not generated or already verified"
    })
   }

if(user.otpExpiry < new Date()){
  return res.status(400).json({
    success:false,
    message:"OTP has expired. Please request a new one."
  })
}

if(otp != user.otp){
  return res.status(400).json({
    success:false,
    message:"Invalid OTP. Please try again."
  })
}
user.otp = null;
user.otpExpiry = null;
await user.save();

return res.status(200).json({
  success:true,
  message:"OTP verified successfully."
})
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}

export const changePassword = async(req,res) =>{
  try {

    const {email} = req.params;
    const{newPassword, confirmPassword} =req.body;
const user = await User.findOne({email});

if(!user){
  return res.status(400).json({
    success:false,
    message:"User not found"
  })
}

if(!newPassword || !confirmPassword){
  return res.status(400).json({
    success:false,
    message:"All fields are required"
  })
}

if(newPassword != confirmPassword){
  return res.status(400).json({
    success:false,
    message:"Passwords do not match.Please try again."
  })
}

const hashedPassword = await bcrypt.hash(newPassword,10);
user.password = hashedPassword;
await user.save();
return res.status(200).json({
  success:true,
  message:"Password changed successfully"
})

  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}

export const allUser = async(req,res) =>{
  try {
    const users = await User.find();
    return res.status(200).json({
      success:true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message: error.message
    })
  }
}


export const getUserById = async(req,res) =>{
  try {
    const {userId} = req.params;
    const user = await User.findById(userId).select("-password -token -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({
        success: false,  
        message: "User not found"
      });
    }
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
