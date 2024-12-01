import bcrypt from "bcrypt"
import { v2 as cloudinary} from "cloudinary"

import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

export const getUserProfile = async (req, res) =>
{
    const {username} = req.params

    try{
        const user = await User.findOne({username}).select("-password")
        if (!user) { return res.status(401).json({error: "User not found"}) }
        res.status(200).json(user)

    } catch (error)
    {
        console.log("Error in getUserProfile: ", error.message)
        res.status(500).json({error: error.message})
    }
}

export const getSuggestedUsers = async (req, res) =>{
    try{
        const userId = req.user._id

        //get following array
        const usersFollowedByMe = await User.findById(userId).select("following")

        // grabbing 10 random users
        const users = await User.aggregate([
            { 
                $match:{
                    // make sure current user's id is not as the one being aggregated
                    _id: {$ne: userId} 
                }
            },
            { $sample: {size: 10}}
        ])

        // filtering out already followed users
        const filteredUsers = users.filter( user => !usersFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user => user.password = null)

        res.status(201).json({suggestedUsers})
    } catch (error)
    {
        console.log("Error in getSuggestedUsers: ", error)
        res.status(500).json({error: error.message})
    }
}

export const followUnfollowUser = async (req, res) =>
{
    try{
        
        const {id} = req.params
        // id is the url/route

        const userToModify = await User.findById(id)
        //passed from protectRoute
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString())
        {
            return res.status(400).json({error: "You cannot follow/unfollow yourself"})
        }

        // check to find if users exist in db
        if (!userToModify || !currentUser)
        {
            return res.status(400).json({error: "One or both users cannot be found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing)
        {
            // Unfollow User
            await User.findByIdAndUpdate(id, { $pull : { followers: currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id, { $pull : { following: id}})
            
            
            
            // send notification to user
            res.status(200).json({message: "User unfollowed successfully"})
        } else
        {
            // FOllow user
            await User.findByIdAndUpdate(id, { $push : { followers: currentUser._id}})
            await User.findByIdAndUpdate(currentUser._id, { $push : { following: id}})
            
            // send notification to user
            const newNotification = new Notification({
                type: "follow",
                from: currentUser._id,
                to: userToModify._id,

            })

            await newNotification.save()
            
            res.status(200).json({message: "User followed successfully"})

        }

    } catch (error)
    {
        console.log("Error in followUnfollow function: ", error.message)
        res.status(500).json({error: error.message})
    }
}

export const updateUser = async(req, res) =>
{
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body
    let {profileImg } = req.body

    const userId = req.user._id

    try{
        let user = await User.findById(userId)
        
        if (!user)  return res.status(404).json({ message: "User not found"})

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword))
        {
            return res.status(400).json({ message: "Please provide both current password and a new password"})
        }
        
        if (currentPassword && newPassword)
        {   
            
            // compare provided password with password in db
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            
            if (!isMatch) return res.status(400).json({ message: "Current Password is incorrect"})
            
            if (newPassword.length < 6){
                return res.status(400).json({ message: "New Password must be atleast 6 characters long"})
            }

            // hash and store new password into db
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if (profileImg)
        {
            if (user.profileImg)
            {
                const img_string = user.profileImg.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(img_string)
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url

        }

        if (coverImg)
            {
                if (user.coverImg)
                {
                    const img_string = user.coverImg.split("/").pop().split(".")[0]
                    await cloudinary.uploader.destroy(img_string)
                }
                const uploadedResponse = await cloudinary.uploader.upload(profileImg)
                coverImg = uploadedResponse.secure_url
    
            }

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg
        

        await user.save();

        user.password = null

        return res.status(200).json(user)
    } catch (error)
    {
        console.log("Error in Update Function: ", error.message)
        res.status(500).json({ error: error.messsage})
    }
}