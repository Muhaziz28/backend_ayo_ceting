import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import Users from "./UserModel.js"

const { DataTypes } = Sequelize

const Edukasi = db.define(
    "edukasi",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        isi: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "",
        },
        upload_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        puskesmas_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

Users.hasMany(Edukasi, { foreignKey: "upload_by" })
Edukasi.belongsTo(Users, { foreignKey: "upload_by" })

export default Edukasi