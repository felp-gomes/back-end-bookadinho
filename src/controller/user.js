




module.exports.login = async ( application , req , res ) => {
    const newsModel = new application.src.model.user();
    await newsModel.login(req , res)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
    });
};

module.exports.home = async ( application , req , res ) => {
    const newsModel = new application.src.model.user();
    await newsModel.home(req , res)
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.send(err);
    });
};
