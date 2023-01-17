


module.exports.getChatsPreview = async (application , req , res) => {
    const newsModel = new application.src.model.chat()
    await newsModel.getChatsPreview(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.getChatsByID = async (application , req , res) => {
    const newsModel = new application.src.model.chat()
    await newsModel.getChatsByID(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}
