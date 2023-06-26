const { selectAllTopics } = require('../models/topics.models')

exports.getAllTopics = (req, res,next) => {
    const { sort_by } = req.query;
    return selectAllTopics(sort_by)
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}