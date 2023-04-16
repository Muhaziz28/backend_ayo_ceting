import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import RolesRoute from "./routes/RolesRoute.js"
import PuskesmasRoute from './routes/PuskesmasRoute.js'
import db from "./config/Database.js"
import UserRoute from "./routes/UserRoute.js"
import AuthRoute from "./routes/AuthRoute.js"
import CategoryPengjuanRoute from "./routes/CategoryPengajuanRoute.js"
import PengajuanRoute from "./routes/PengajuanRoute.js"
import EdukasiRoute from "./routes/EdukasiRoute.js"
import { Sequelize } from "sequelize"

dotenv.config();

// (async () => {
//   await db.sync();
// })();

const app = express()

app.use(cors())
app.use(express.json())

app.use(RolesRoute)
app.use(PuskesmasRoute)
app.use(UserRoute)
app.use(AuthRoute)
app.use(CategoryPengjuanRoute)
app.use(PengajuanRoute)
app.use(EdukasiRoute)

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}...`)
})