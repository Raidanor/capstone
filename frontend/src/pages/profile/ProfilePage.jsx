import { useRef, useState } from "react"
import { Link } from "react-router-dom"

import Posts from "../../components/Posts.jsx"
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileheaderSkeleton.jsx"
import EditProfileModal from "./EditProfileModal"

import { POSTS } from "../../utils/sampledata.jsx"

import { FaArrowLeft } from "react-icons/fa6"
import { IoCalendarOutline } from "react-icons/io5"
import { FaLink } from "react-icons/fa"
import { MdEdit } from "react-icons/md"

const ProfilePage = () =>
{
    const [coverImg, setCoverImg] = useState(null)
    const [profileImg, setProfileImg] = useState(null)
    const [feedType, setFeedType] = useState("")

    const coverImgRef = useRef(null)
    const profileImgRef = useRef(null)
    
    const isLoading = false
    const isMyProfile = true

    const user = {
        _id: "0",
        fullName: "Ansaar Khadaroo",
		username: "ansaar",
		profileImg: "/avatars/boy2.png",
		coverImg: "/cover.png",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		link: "",
		following: ["1", "2", "3", "4", "5", "6", '7'],
		followers: ["1", "2", "3"],
    }

    const handleImgChange = (e, state) =>
    {
        const file = e.target.files[0]

        if (file) 
        {
            const reader = newFileReader()
            
            reader.onload = () =>
            {
                state === "coverImg" && setCoverImg(reader.result)
                state === "profileImg" && setProfileImg(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }




    return(
        <>
            <div className="flex-[4_4_0] border-r border-gray-400 min-h-screen">

                {isLoading && <ProfileHeaderSkeleton />}
                {!isLoading && !user && <p className="text-center text-lg mt-4">User Not Found</p>}

                <div className="flex flex-col">
                    {!isLoading &&user && (
                        <>
                            <div className="flex gap-10 px-4 py-2 items-center">
                                <Link to="/">
                                    <FaArrowLeft className="w-4 h-4" />
                                </Link>
                                <div className="flex flex-col">
                                    <p className="font-bold text-lg">{user?.fullName}</p>
                                    <span className="text-sm text-slate-500">{POSTS?.length} posts</span>
                                </div>
                            </div>
                            {/* Cover Img */}
                            <div className="realtive group/cover">
                                <img
                                    src={coverImg || user?.coverImg || "cover.png"}
                                    className="h-52 w-full object-cover"
                                />
                                
                                {isMyProfile && (
                                    <div className="absolute top-2 righ-2 rounded-full p-2 bg-gray-400 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                                        onClick={() => coverImg.current.click()}
                                    >
                                        <MdEdit className="w-5 h-5 text-white" />
                                    </div>
                                )}

                                <input 
                                    type="file"
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImg")}
                                />
                                <input 
                                    type="file"
                                    hidden
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                {/* USER AVATAR */}
                                <div className="avatar absolute -bottom-16 left-4">
                                    <div className="w-32 rounded-full relative group/avatar">
                                        <img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
                                        <div className="abodolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                                            {isMyProfile && (
                                                <MdEdit 
                                                    className="w-4 h-4"
                                                    onClick={() => profileImgRef.current.click()}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end px-4 mt-5">
                                {isMyProfile && <EditProfileModal />}
                                {!isMyProfile && (
                                    <button className="btn btn-outline rounded-full btn-sm" onClick={() => alert("User followed successfully")}>Follow</button>
                                )}
                                {(coverImg || profileImg) && (
                                    <button className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                                        onClick={() => alert("Profiule Updated successfully")}>Update</button>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 mt-14 px-4">
                                <div className="flex flex-col">
                                    <span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    { user?.link && (
                                        <div className="flex gap-1 items-center">
                                            <>
                                                <FaLink className="w-3 h-3 text-slate-500" />
                                                
                                            </>
                                        </div>
                                    )}
                                    <div className="flex gap-2 items-center">
                                        <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slae-500">Joined November 2024</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">{user?.following.length}</span>
                                        <span className="text-slate-500 text-xs">Following</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-xs">{user?.followers.length}</span>
                                        <span className="text-slate-500 text-xs">Followers</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-full border-b border-gray-400 mt-4">
                                <div 
                                    className="flex justify-center flex-1 p-3 hover:bg-secondary transitin duration-300 realtive cursor-pointer"
                                    onClick={() => setFeedType("posts")}
                                >
                                    Posts
                                    {feedType === "posts" &&(
                                        <div className="absolute bottom-0 w-10 h01 rounded-full bg-primary" />
                                    )}
                                </div>
                                <div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
                            </div>
                        </>
                    )}
                    <Posts />
                </div>
            </div>
        </>
    )
}

export default ProfilePage