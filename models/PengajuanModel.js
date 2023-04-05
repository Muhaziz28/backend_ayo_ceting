import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import CategoryPengajuan from "./CategoryPengajuanModel.js"
import Device from "./DeviceModel.js"

const { DataTypes } = Sequelize

const Pengajuan = db.define(
    "pengajuan",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        isi_pengajuan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_pengajuan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lokasi: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: false,
        },
        alamat_lengkap: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["pending", "approved", "rejected"],
            defaultValue: "pending",
        }
    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

CategoryPengajuan.hasMany(Pengajuan, { foreignKey: "category_pengajuan_id" })
Pengajuan.belongsTo(CategoryPengajuan, { foreignKey: "category_pengajuan_id" })

Device.hasMany(Pengajuan, { foreignKey: "device_id" })
Pengajuan.belongsTo(Device, { foreignKey: "device_id" })

export default Pengajuan