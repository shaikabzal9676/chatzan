import jwt from 'jsonwebtoken'
import User from '../models/User.js'


export const protectRoute=async(req,res,next)=>{

    try {
        const token=req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"})
        }

        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decode){
            return res.status(401).json({message:"Unathorized - Invalid Token"})

        }
        const user=await User.findById(decode.userId).select("-password")

        if(!user){
            return res.status(401).json({message:"Unauthorized - User Not Found"})

        }
        req.user=user;
        next();

    } catch (error) {
        console.log("Error in protectRoute Middleware",error)
        res.status(500).json({message:"Internal Server Error"})
        
    }

}