import express from "express"
import jwt from "jsonwebtoken"
import {checkPassword,encryptPassword} from "../utility/password"
import User from "../models/user"
import jwtKey from "../utility/jwtKey"

const router = express.Router()


router.post('/registration', async (req, res) => {
  console.log(req.body)

  try {
    const hashedPassword: string = await encryptPassword(req.body.password);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      chancesLeft: 3,
    })

    res.json({ status: 'ok'})
  } catch (error) {
    console.log(error)
    res.json({ status: 'error', error: error })
  }
})


router.post('/login', async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    const user = users[0]; 

    console.log(user);

    if (!user) {
      return res.json({ status: 'error', user: false, message: 'User does not exist' });
    }

    const passwordMatch: boolean = await checkPassword(user.password, req.body.password);
    console.log(passwordMatch);

    console.log("secret " + jwtKey);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        jwtKey,
        { expiresIn: '1 hours' },
      );

      console.log(token);
      return res.json({ status: 'ok', user: token, username: user.name });
    } else {
      return res.json({ status: 'error', user: false, message: 'Passwords do not match' });
    }
  } catch (error) {
      console.error('Error during login:', error);
    return res.json({ status: 'error', error: error });
  }
});




export default router;