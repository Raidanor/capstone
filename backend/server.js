import express from "express"
import path from "path"

import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"


import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(express.json({ limit: "5mb" }))
app.use(cookieParser()) // for jwt cookies




app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/notifications", notificationRoutes)

if (process.env.NODE_ENV === "production")
{
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "fronend", "dist", "index.html"))
    })
}

app.listen(PORT, () =>
{
    connectMongoDB()
    
    console.log(`Server is running on port ${PORT}`)
})

