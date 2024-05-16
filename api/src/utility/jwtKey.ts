import dotenv from "dotenv"
dotenv.config()

const jwtKey: string = process.env.JWT_KEY || ''

export default jwtKey