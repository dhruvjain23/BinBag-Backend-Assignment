import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import { connectDB } from './db.js';
import router from './routes.js';


dotenv.config();
const app =express();
app.use(express.json())
app.use(cookieParser())

app.use('/api',router)


app.listen(process.env.PORT,()=>{
    console.log(`App is listening on the ${process.env.PORT}`)
    connectDB();
})