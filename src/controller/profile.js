


module.exports.getSalvos = async (application , req , res) => {
    const newsModel = new application.src.model.profile()
    await newsModel.getSalvos(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.getProfile = async (application , req , res) => {
    const newsModel = new application.src.model.profile()
    await newsModel.getProfile(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.getProfileById = async (application , req , res) => {
    const newsModel = new application.src.model.profile()
    await newsModel.getProfileById(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.createProfile = async (application , req , res) => {
    const newsModel = new application.src.model.profile()
    await newsModel.createProfile(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

module.exports.editProfile = async (application , req , res) => {
    const newsModel = new application.src.model.profile()
    await newsModel.editProfile(req , res)
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        res.json(err)
    })
}

