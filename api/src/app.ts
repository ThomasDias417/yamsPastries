import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import connexionRoutes from "./routes/connexionRoute"
import pastriesRoutes from "./routes/pastriesRoute"
import gameRoutes from "./routes/gameRoute"
import choosePastriesRoutes from "./routes/choosePastriesRoute"
import winnersRoutes from "./routes/winnersRoute"


const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://mongoDb:27017/yams_db', {}) 
.then(() => {
  ('Connexion à MongoDB réussie')
})
.catch((error) => {
  console.error('Erreur de connexion à MongoDB :', error)
})

app.use('/', connexionRoutes)
app.use('/', pastriesRoutes)
app.use('/', gameRoutes)
app.use('/', choosePastriesRoutes)
app.use('/', winnersRoutes)


app.listen(port, () => (`App démarrée sur http://localhost:${port}`));
