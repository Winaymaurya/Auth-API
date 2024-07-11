import express from "express";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js'
import dotenv from "dotenv"

const app=express()
dotenv.config()

app.use(express.json())

// Db connection
const db= async()=>{
    try {
        await mongoose.connect(process.env.CLUSTER)
        console.log(`db is connected`);
    } catch (error) {
        console.log(`Error in mongodb${error}`);
    }
}
db();

// routes
app.use('/api/v1/auth',authRoutes)


const PORT=process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`) 
})
