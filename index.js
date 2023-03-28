import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import RolesRoute from "./routes/RolesRoute.js"
import db from "./config/Database.js"

import { Sequelize } from "sequelize"

dotenv.config();

// (async () => {
//   await db.sync();
// })();

const app = express()

app.use(express.json())
app.use(RolesRoute)

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}...`)
})

