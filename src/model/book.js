

const { books } = require('../../mocks/books.js');

function book() {}

book.prototype.changeBook = async ( req , res ) => {
    return new Promise ((resolve , reject) => {
        const { bookid } = req.params;
        const { bookname, bookauthor, description} = req.body;
        books.map((book) => {
            if(bookid == book.id) {
                book.name = bookname;
                book.author = bookauthor;
                book.description = description;
                book.isChange == true;
            }
        }).then((e) => {
            console.log(e)
        })
    });
};


module.exports = function () {
    return book;
}