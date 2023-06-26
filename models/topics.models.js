const db = require('../db/connection')

exports.selectAllTopics = (sort_by) => {
    let query = "SELECT * FROM topics "
    const validSortBy = ["slug"]
    if (!validSortBy.includes(sort_by) && sort_by) {
        return Promise.reject({ status: 400, msg:"Bad request" })
    }
    if (sort_by) {
        query += `ORDER BY ${sort_by}`
    }
    return db.query(query).then(({rows}) => {
        return rows
    })
}