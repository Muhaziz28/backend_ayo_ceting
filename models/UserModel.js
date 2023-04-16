import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import Roles from "./RolesModel.js"
import jwt from "jsonwebtoken"

const { DataTypes } = Sequelize

const Users = db.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        puskesmas_id: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

Roles.hasMany(Users, { foreignKey: "role_id" })
Users.belongsTo(Roles, { foreignKey: "role_id" })

export default Users