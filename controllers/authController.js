import bcryptjs from 'bcryptjs'
import User from "../model/user.model.js";
import { generateToken } from '../src/jwt.js';



export const signup = async(req,res)=>{
    const {email,fullName,password,address}=req.body;

    try {
        if(!fullName || fullName.trim()==='' || !email || email.trim()==='' || !address || address.trim()===''){
            return res.status(400).json({message:"All field is required"})
        }
    
        if(!password || password.length<8){
            return res.status(400).json({message:'Password must be atleast 8 characters'})
        }
    
        const user= await User.findOne({email})
        if(user) return res.status(400).json({message:"User with this mail is already exits"})
        
        const salt= await bcryptjs.genSalt(10);
        const hashedPassword= await bcryptjs.hash(password,salt)
    
        const newUser= new User({
            fullName,
            email,
            address,
            password:hashedPassword
        })
    
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({message:"User Created Successfully"})
        }
        else{
            res.status(400).json({message:"Error in creating user"})
        }
    } catch (error) {
        console.log("Error in Signup Controller",error)
        res.status(400).json({message:"Error in signup"})
    }
}

export const login=async(req,res)=>{
    const {email,password}= req.body;
    const user= await User.findOne({email})

    try {
        if(!user){
            return res.status(400).json({message:"Invalid Credentials!"})
        }
        const isPassCorrect= await bcryptjs.compare(password,user.password)
        if(!isPassCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
        generateToken(user._id,res)

        res.status(202).json({message:"Login successfully"})
    } catch (error) {
        console.log("Error im login function", error.message)
        res.status(400).json({message:"Internal server error"})
    }
}


export const getProfile = (req,res)=>{
    try {
        if(!req.user){
            return res.status(401).json({message:"Not Authorised!"})
        }
        res.status(200).json({
            message:"Profile fetched successfully",
            Name:req.user.fullName,
            Email:req.user.email,
            Address:req.user.address
        })
    } catch (error) {
        console.log("Error in getprofile controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile= async(req,res)=>{
    try {
        const {email, fullName,address}= req.body;
        const fieldsToUpdate={}

        if(email){
            fieldsToUpdate.email= email
        }
        if(fullName){
            fieldsToUpdate.fullName= fullName
        }
        if(address){
            fieldsToUpdate.address= address
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            fieldsToUpdate,
            { new: true }
        ).select('-password');

        res.status(200).json({
            message:"Profile Updated Successfully",
            user:updatedUser
        })
    } catch (error) {
        console.log("Error in UpdateProfile Comtroller",error.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}