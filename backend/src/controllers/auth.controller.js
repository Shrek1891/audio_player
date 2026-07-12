import {User} from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
    console.log(req.auth)
    try {
        const {id, firstName, lastName, email, imageUrl} = req.body
        const user = await User.findOne({clerkId: id})
        if (!user) {
            await User.create({
                clerkId: id,
                firstName,
                fullName: lastName,
                email,
                imageUrl
            })
        }
        res.status(200).json({success: true})
    } catch (e) {
        console.log("Error in auth callback:", e)
        next(e)
    }
}

