import express from "express"
import jwt from "jsonwebtoken"

import User from "../models/user"
import Pastry from "../models/pastrie"
import Winner from "../models/winner"

import { DecodedToken } from '../type/jwt'
import jwtKey from "../utility/jwtKey"

const router = express.Router()


router.get("/pastries-left-to-win", async(req, res) => {
    try {
      let pastriesLeft = await Pastry.find({
        stock: { $gt: 0 },
      })
      res.json(pastriesLeft)
    } catch (err) {
        console.error("Erreur :", err)
        res.status(500).json({ message: "erreur db" })
    }
})


router.post("/choose-pastries", async(req, res) => {
    const token: string = req.headers['x-access-token'] as string;
  
    try {
      const decoded = jwt.verify(token, jwtKey) as DecodedToken
      const email: string = decoded.email
      const user = await User.findOne({ email: email })
  
      if (user) {
        await Winner.create({
          userName: user.name,
          email: user.email,
          date: req.body.winningDate,
          numberOfPastriesWon: req.body.numberOfPastriesWon,
          pastries: req.body.pastriesChoosed,
        })
  
        let pastriesChoosed = req.body.pastriesChoosed
        await Promise.all(pastriesChoosed.map(async (pastry: typeof Pastry) => {
        await Pastry.findOneAndUpdate(
          { name: pastry.name, stock: { $gt: 0 } },
          { $inc: { quantityWon: 1, stock: -1 }},
        )
        }))
      }
      res.json({ status: 'ok'})
  
    } catch (err) {
        console.error("Erreur :", err)
            return res.status(500).json({ status: 'error', error: 'token error' })
    }
})

export default router;