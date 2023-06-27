const endpoints = require('../endpoints.json')

exports.getApi = ( __, res) => {
        res.status(200).send({endpoints})
}