import axios from 'axios'
import payload from '../response_format.js'

export const getAllPuskesmas = async (req, res) => {
    try {
        const puskesmas = await axios.get('http://103.141.74.121:81/api/v1/master-puskesmas')
        const result = puskesmas.data.data
        return payload(200, true, "Puskesmas found", result, res)
    } catch (err) {
        return payload(500, false, err.message, null, res)
    }
}