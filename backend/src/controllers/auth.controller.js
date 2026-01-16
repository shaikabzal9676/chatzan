import { upsertStreamUser } from "../lib/Stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 charcters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already Exists, Use Different Email" });
    }

    const seed = Math.random().toString(36).slice(2, 10);
const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;


    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: avatar,
    });

    try{

    await upsertStreamUser({
        id:newUser._id,
        name:newUser.fullName,
        image:newUser.profilePic||"",

    })
    console.log(`Stream user Created for ${newUser.fullName}`)

}
catch(error){
    console.log("Error creating stream User",error)
}


    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in Controller ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isPasswordCorrect = await user.matchPassword(String(password));
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

     const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log("Error in login Controller ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({success:true, message:"LogOut Successful"})
}
 
export async function onboarding(req,res){

    try {
        const userId=req.user._id
        const {fullName,bio,location,language}=req.body
        if(!fullName||!bio||!location||!language){
            return res.status(400).json(
                {
                    message:"All Fields are required",
                    missingFields:[
                        !fullName && "fullName",
                        !bio && "bio",
                        !location && "location",
                        !language && "language"
                    ].filter(Boolean)
                }
            )
        }

       const updatedUser= await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true})
    
        if(!updatedUser){
            return res.status(400).json({message:"User Not Found"})
        }
            try {
                await upsertStreamUser({
                    id:updatedUser._id.toString(),
                    name:updatedUser.fullName,
                    image:updatedUser.profilePic||"",
                    location:updatedUser.location,
                    language:updatedUser.language
                })
                console.log(`Stream User updated after Onboarding ${updatedUser.fullName}`)
            } catch (error) {
                console.log("Error in upserting User in Stream")
                res.status(500).json({message:"Internal Server Error"})
            }
        
        res.status(200).json({success:true,user:updatedUser})

    } catch (error) {
        console.log("Onborading Error",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}