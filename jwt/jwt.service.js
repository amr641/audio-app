import jwt from "jsonwebtoken"
export const getAccessToken = async (user) => {
    try {

        return jwt.sign({ userId: user._id }, process.env.ACCESSTOKEN_KEY)
    } catch (error) {
        console.log(error)
    }
}


