import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import Pengajuan from "./PengajuanModel.js"

const { DataTypes } = Sequelize
const VonisAwal = db.define(
    "vonis_awal",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pengajuan_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vonis: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

Pengajuan.hasOne(VonisAwal, { foreignKey: "pengajuan_id" })
VonisAwal.belongsTo(Pengajuan, { foreignKey: "pengajuan_id" })

export default VonisAwal