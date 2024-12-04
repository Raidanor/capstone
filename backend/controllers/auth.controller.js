import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateTokenAndSetCookie } from "../lib/utils/generatetoken.js"

export const signup = async (req, res) => {
    try{
        const {fullName, username, email, password } = req.body
        
        // i dont know how this works but im using it
        // it checks if the email is in the correct format, nothing more
        // returns boolean
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid email format"})   
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({error: "Username is already taken"})
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({error: "Email is already taken"})
        }

        
        
        if ( password.length < 6)
        {
            res.status(400).json({ error: "Password must be atleast 6 characters long"})
        }

        // if all conditions are right
        // Hashing password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword,
        })

        if (newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                link: newUser.link
            })
        }
        else{
            res.status(400).json({ error: "Invalid User Data"})
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }

}

export const login = async (req, res) => {
    try{
        
        const { username, password } = req.body
        const user = await User.findOne({ username })

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "") //if password is null/undefined prevents app from crashing

        // check is passwords match
        if (!user || !isPasswordCorrect)
        {
            return res.status(400).json({ error: "Invalid username or password"})
        }
        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bio: user.bio,
            link: user.link,
        })

    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully"})

    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

export const getMe = async (req, res) => 
{
    try{
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json({user})
        
    } catch (error)
    {
        console.log("Error in getMe function: ", error.message)
        return res.status(401).json({error: "Internal Server Error"})
    }
}