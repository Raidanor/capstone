import { useState } from "react"
import { Link } from "react-router-dom"

import XSvg from "../../../components/X"

import { MdOutlineMail } from "react-icons/md"
import { MdPassword } from "react-icons/md"
import { FaUser } from "react-icons/fa"
import { MdDriveFileRenameOutline } from "react-icons/md"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const SignUpPage = () =>
{
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        username: "",
        password: ""
    })

    const { mutate:signupMutation, isError, isPending, error} = useMutation({
        mutationFn: async({email, username, fullName, password}) =>
        {
            try{
                const res = await fetch("/api/auth/signup", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({email, username, fullName, password})
                })

                const data = await res.json()
                if (data.error) throw new Error(data.error)
                
                console.log(data)
                if (!res.ok) throw new Error(data.error) || "failed to create account"
                return data
            } catch (error)
            {
                console.error(error)
                toast.error(error.message)
            }
        },
        onSuccess: () =>{
            toast.success("Account Created successfully")
            queryClient.invalidateQueries({ queryKey: ["authUser"]})
        },
    })

    const handleSubmit = (e) =>
    {
        e.preventDefault()
        signupMutation(formData)
    }

    const handleInputChange = (e) =>
    {
        setFormData({ ...formData, [e.target.name]: e.target.value})
    }


    
    return(
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            <div className="flex-1 flex flex-col justify-center items-center">
                <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
                    <XSvg className= "w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white">Join Today!</h1>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type = "email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value = {formData.email}
                        />
                    </label>
                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser />
                            <input
                                type = "text"
                                className="grow"
                                placeholder="Username"
                                name="username"
                                onChange={handleInputChange}
                                value = {formData.username}
                        />
                        </label>
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline />
                            <input
                                type = "text"
                                className="grow"
                                placeholder="Fullname"
                                name="fullName"
                                onChange={handleInputChange}
                                value = {formData.fullName}
                            />
                        </label>
                    </div>
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <input
                            type = "password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value = {formData.password}
                        />
                    </label>
                    <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                        {isPending ? "Loading..." : "Sign up"}
                    </button>
                    { isError && <p className="text-red-500 ">{error.message}</p>}
                </form>
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-primary text-white btn-outline w-full">Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage