import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt
        //check if there is a token
        if (!token)
        {
            return res.status(401).json({error: "Unauthorised: No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //check if token is valid
        if (!decoded)
        {
            return res.status(401).json({error: "Unauthorised: Invalid ttoken"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        //check if token value matches the user in db
        if (!user)
        {
            return res.status(401).json({error: "User Not found"})
        }

        req.user = user
        next()
    } catch (error){
        console.log("Error in protectRoute.js: ", error.message)
        return res.status(401).json({error: "Internal Server Error"})
    }
}