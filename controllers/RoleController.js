import Roles from "../models/RolesModel.js"
import payload from "../response_format.js"

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll();
        const result = roles.map((role) => {
            return {
                id: role.id,
                role_name: role.role_name
            }
        })
        return payload(200, true, "Success", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
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
            return payload(404, false, "Role not found", null, res)
        }
        const result = {
            id: role.id,
            role_name: role.role_name
        }
        return payload(200, true, "Success", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}

export const createRole = async (req, res) => {
    try {
        const { role_name } = req.body;
        const roleExist = await Roles.findOne({
            where: {
                role_name: role_name
            }
        });
        if (roleExist) {
            return payload(400, false, "Role already exist", null, res)
        }
        const role = await Roles.create({
            role_name: role_name
        });
        return payload(200, true, "Role created", role, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
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
            return payload(404, false, "Role not found", null, res)
        }
        if (role_name === role.role_name) {
            return payload(400, false, "Role name is the same", null, res)
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
        return payload(200, true, "Role updated", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
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
            return payload(404, false, "Role not found", null, res)
        }
        await Roles.destroy({
            where: {
                id: id
            }
        })
        return payload(200, true, "Role deleted", null, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}