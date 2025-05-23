import mongoose from 'mongoose'

export const connectDB= async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo DB Connected ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in connecting the DB ${error}`)
    }
}