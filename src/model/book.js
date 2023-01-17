

const { books } = require('../../mocks/books.js');
const { profiles } = require('../../mocks/profiles.js');

function Book() {}

Book.prototype.getRegisteredBooks = async (req , res) => {
    return new Promise ((resolve) => {
        const { profileid } = req.params;
        if (!profiles.some((profile) => profile.id === profileid)) {
            result = {
                status: '203',
                message: 'O identificador do perfil é obrigatório',
            }
            resolve(result)
        } else {
            const booksUser = books.filter((book) => book.profile.id === profileid)
            result = {
                status: '200',
                result: booksUser
            }
            resolve(result)
        }
    })
};


Book.prototype.registerBook = async (req , res) => {
    return new Promise ((resolve) => {
        const { name, author, description, photo, profileid } = req.body
        const bookOwner = profiles.find((profile) => profileid === profile.id)
        if (
            !name ||
            !author ||
            !description ||
            !photo ||
            !profileid ||
            !bookOwner
        ) {
            result = {
                status: '203',
                message: 'Nome do livro, o autor, a descrição, a imagem do livro e usuário são obrigatórios!'
            }
            resolve(result)
        } else {
            const indexBookCreated = books.push({
                id: `000${books.length + 1}`,
                name,
                author,
                description,
                photo,
                profile: {
                    id: bookOwner.id,
                    userName: bookOwner.userName,
                },
            })
            const bookCreated = [books[indexBookCreated - 1]]
            result = {
                status: '200',
                result: bookCreated
            }
        }
    })
};

Book.prototype.changeBook = async ( req , res ) => {
    return new Promise ((resolve , reject) => {
        const { bookid } = req.params;
        const book = books.filter((book) => bookid === book.id)
        if (book.length > 0) {
            result = {
                status: '200',
                result: book
            }
            resolve(result)
        } else {
            result = {
                status: '204',
                message: 'Livro não encontrado!'
            }
            resolve(result)
        }
    });
};

module.exports = function () {
    return Book;
}