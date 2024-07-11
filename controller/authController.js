import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../model/userModel.js";
import JWT from "jsonwebtoken";

export const registerController= async(req,res)=>{
    try {
      const {name,email,password,phone,address,answer}=req.body;
      // validation
      if(!name){
          return res.send({message:"Name is Required"})
      }
      if(!email){
          return res.send({message:"email is Required"})
      }
      if(!password){
          return res.send({message:"password is Required"})
      }
      if(!phone){
          return res.send({message:"phone is Required"})
      }
      if(!address){
          return res.send({message:"address is Required"})
      }
      if(!answer){
          return res.send({message:"Answer is Required"})
      }
  
      const existingUser= await userModel.findOne({email})
      if(existingUser){
          return res.status(200).send({
              success:false,
              message:"Already Registered please Login"
          })
      }
      const hashedPassword= await hashPassword(password)
      
  
      // Save data
  
      const user= await new userModel({name,email,password:hashedPassword,phone,address,answer}).save();
      res.status(201).send({
          success:true,
          message:"User Created",
          user
      });
  
    } catch (error) {
       console.log(error)
       res.status(500).send({
          success:false,
          message:"Failed To register",
          error
       })
    } 
  }
  // Login controller*********************************************
  export const loginController=async(req,res)=>{
       try {
          const {email,password}=req.body
          if(!email || !password){
              res.status(200).send({
                  success:false,
                  message:"invalid email or password"
              })
          }
          const user= await userModel.findOne({email});
          if(!user){
              return res.status(200).send({
                  success:false,
                  message:"Email is not Registered"
              })
          }
        
      //  console.log(password)
      //  console.log(user)
          const match =await comparePassword(password,user.password)
          if(!match){
              return res.status(200).send({
                  success:false,
                  message:"Invalid Password"
              })
          }
        
  
          const token= await JWT.sign({_id:user._id},
              process.env.JWT_SECRET,
              {expiresIn:'7d'},)
  
          res.status(200).send({
              success:true,
              message:"Login Successful",
              user:{
                  name:user.name,
                  email:user.email,
                  phone:user.phone,
                  address:user.address,
                  role:user.role
              },
              token
          })
  
       } catch (error) {
          console.log(error)  
          res.status(500).send({
              success:false,
              message:"Error in login",
              error
          })
       }
  }
  
  // Forgot Password  *********************
  export const forgotPasswordController=async(req,res)=>{
     try {
       const {email,answer,newPassword}=req.body
  if(!email){
      res.status(400).send({message:"Email is required"})
  }
  if(!answer){
      res.status(400).send({message:"Answer is required"})
  }
  if(!newPassword){
      res.status(400).send({message:"New Password is required"})
  }
    const user= await userModel.findOne({email,answer})
      if(!user){
          return res.status(200).send({
              success:false,
              message:"Wrong Email or Answer"
          })
      }
      const hashed= await hashPassword(newPassword)
      await userModel.findByIdAndUpdate(user._id,{password:hashed})
      res.status(200).send({
          success:true,
          message:"New Password Updated"
      })
     } catch (error) {
      console.log(error)
      res.status(500).send({
          success:false,
          message:"Something went Wrong",
          error
      })
     }
  }