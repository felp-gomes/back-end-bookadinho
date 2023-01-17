




module.exports = function (application) {
    application.get('/books/registered_books/:profileid' , function ( req , res) {
        application.src.controller.book.getRegisteredBooks(application , req , res)
    });
    application.post('/register_book' , function (req , res) {
        application.src.controller.book.registerBook(application , req ,res)
    })
    application.put('/change_book/:bookid', function (req, res) {
        application.src.controller.book.changeBook(application, req, res);
    });


}