import express from "express"
import User from "../models/user"
import { DecodedToken } from '../type/jwt'
import jwt from "jsonwebtoken"
import jwtKey from "../utility/jwtKey"
import {
  randomNumber,
  resultPastriesWon
} from "./../game/yamsGame"

const router = express.Router()

// Return the number of chances left for a user
router.get("/chances-left/:email", async (req, res) => {
    try {
      let user = await User.findOne({email: req.params.email,})
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" })
      }
      let chancesLeft: number = user.chancesLeft
      res.json(chancesLeft.toString())
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des chances restantes" })
    }
})


router.post("/rolling-dices", async(req, res) => {
    let dices = [
      4,
      4,
      4,
      4,
      randomNumber()
    ]
    console.log(dices)
  
    const token: string = req.headers['x-access-token'] as string;
  
    try {
      let decoded = jwt.verify(token, jwtKey) as DecodedToken;
      let email: string = decoded.email
      let user = await User.findOne({ email: email })
  
      if (user) {
        let won = 0
        if (user.chancesLeft <= 0) {
          dices = [0, 0, 0, 0, 0]
          return res.json({ status: 'error', error: 'plus de chance', chancesLeft: user.chancesLeft, dices: dices, numberOfPastriesWon: won })
        }
        
        let occurenceDice = resultPastriesWon(dices)
        if (occurenceDice != 0) {
          user.chancesLeft = 0
        } else {
          user.chancesLeft--
        }
        await user.save()
        return res.json({ dices: dices, chancesLeft: user.chancesLeft, numberOfPastriesWon: occurenceDice })
  
      } else {
        throw new Error('User not found')
      }
  
    } catch (error) {
          console.log(error)
          return res.status(500).json({ status: 'error', error: 'token error' })
    }
})




export default router;