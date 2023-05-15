import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import CategoryPengajuan from "./CategoryPengajuanModel.js"
import Users from "./UserModel.js"

const { DataTypes } = Sequelize

const Pengajuan = db.define(
    "pengajuan",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isi_pengajuan: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
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
        },
        discussion_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

Users.hasMany(Pengajuan, { foreignKey: "user_id" })
Pengajuan.belongsTo(Users, { foreignKey: "user_id" })

export default Pengajuan