import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

export const protectRoute= async(req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Unauthorized!- No Token Provided"})
        }

        const decodedToken= jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken){
            return res.status(401).json({message:"Unauthorized!- Invalid Token"})
        }

        const user= await User.findById(decodedToken.userId).select("-password")

        if(!user){
            return res.status(401).json({message:"User not found"})
        }

        req.user=user;
        next();

    } catch (error) {
        console.log("Error in authMiddleWare funuction",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
