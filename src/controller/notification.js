

module.exports.getNotifications = async  (application , req , res) => {
    const newsModel = new application.src.model.notification()
    await newsModel.getNotifications(req, res)
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        res.send(err)
    })
};

module.exports.createNotification = async function (application , req , res) {
    const newsModel = new application.src.model.notification();
    await newsModel.createNotification(req , res)
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        res.send(err)
    })
}

