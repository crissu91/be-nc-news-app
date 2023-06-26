exports.getApi = ( __, res) => {
    res.status(200).send({msg : "Everything is working fine!"})
}