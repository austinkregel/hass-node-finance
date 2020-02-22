const axios = require('axios');
module.exports = class HassIoController {
    async index(req, res) {
        const { data } = await axios.get('http://hassio/homeassistant/info')

        return {
            data
        }
    }
}