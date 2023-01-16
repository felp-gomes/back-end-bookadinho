




module.exports = function (application) {
    application.put('/change_book/:bookid', function (req, res) {
        application.src.controller.book.teste(application, req, res);
    });
}