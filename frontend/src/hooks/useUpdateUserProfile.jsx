import toast from "react-hot-toast"
import { useQueryClient, useMutation } from "@tanstack/react-query"

const useUpdateUseProfile = (formData) =>
{
    const queryClient = useQueryClient()
    const {mutateAsync:updateProfile, isPending:isUpdatingProfile} = useMutation({
        mutationFn:async(formData) => {
            try {
                const res = await fetch("api/users/update/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(formData)
                })

                const data = await res.json()

                if (!res.ok) {throw new Error(data.error || "Something went wrong")}

                return data
            } catch (error) {
                throw new Error(error)
            }
        }, onSuccess:() => {
            toast.success("Profile updated")
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["authUser"]}),
                queryClient.invalidateQueries({queryKey: ["userProfile"]}),
            ])
        }, onError:(error) => {
            toast.error(error.message)
        }
    })

    return {updateProfile, isUpdatingProfile}
}

export  default useUpdateUseProfile