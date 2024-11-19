import express from "express"
import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"


import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser"

dotenv.config()

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // to parse req.body
app.use(cookieParser()) // for jwt cookies


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notifications", notificationRoutes)



app.listen(PORT, () =>
{
    connectMongoDB()
    
    console.log(`Server is running on port ${PORT}`)
})

