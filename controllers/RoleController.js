import Roles from "../models/RolesModel.js"
import payload from "../response_format.js"

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll();

        return payload("OK", true, 200, "Success", roles, res)
    } catch (err) {
        return payload("ERROR", false, 500, err.message, null, res)
    }
}

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Roles.findOne({
            where: {
                id: id
            }
        });

        if (!role) {
            return payload("ERROR", false, 404, "Role not found", null, res)
        }

        return payload("OK", true, 200, "Success", role, res)
    } catch (err) {
        return payload("ERROR", false, 500, err.message, null, res)
    }
}

export const createRole = async (req, res) => {
    try {
        const { role_name } = req.body;

        const role = await Roles.create({
            role_name: role_name
        });

        return payload("OK", true, 200, "Success", role, res)

    } catch (err) {
        return payload("ERROR", false, 500, err.message, null, res)
    }
}

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role_name } = req.body;

        const role = await Roles.findOne({
            where: {
                id: id
            }
        });

        if (!role) {
            return payload("ERROR", false, 404, "Role not found", null, res)
        }

        const update = await Roles.update(
            {
                role_name: role_name
            },
            {
                where: {
                    id: id
                }
            }
        )

        const result = await Roles.findOne({
            where: {
                id: id
            }
        });

        return payload("OK", true, 200, "Role updated", result, res)
    } catch (err) {
        return payload("ERROR", false, 500, err.message, null, res)
    }
}

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Roles.findOne({
            where: {
                id: id
            }
        })

        if (!role) {
            return payload("ERROR", false, 404, "Role not found", null, res)
        }

        await Roles.destroy({
            where: {
                id: id
            }
        })

        return payload("OK", true, 200, "Role deleted", null, res)
    } catch (err) {
        return payload("ERROR", false, 500, err.message, null, res)
    }
}