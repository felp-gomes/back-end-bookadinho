

module.exports.getRegisteredBooks = async (application , req , res) => {
    const newsModel = new application.src.model.book()
    await newsModel.getRegisteredBooks(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
};

module.exports.registerBook = async (application , req , res) => {
    const newsModel = new application.src.model.book()
    await newsModel.registerBook(req, res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(result)
    })
}

module.exports.changeBook = async ( application , req , res ) => {
    const newsModel = new application.src.model.book();
    await newsModel.changeBook(req , res)
    .then((result) => {
        console.log(result)
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

