



module.exports.teste = async ( application , req , res ) => {
    const newsModel = new application.src.model.book();
    await newsModel.changeBook(req , res)
    .then((result) => {
        console.log(result)
        res.status(200).send(result)
    })

}



// app.get('/books/registered_books/:profileid', (req, res) => {
//     const { profileid } = req.params
//     if (!profiles.some((profile) => profile.id === profileid)) {
//         return res.json({
//             status: '203',
//             message: 'O identificador do perfil é obrigatório',
//         })
//     }
//     const booksUser = books.filter((book) => book.profile.id === profileid)
//     return res.json({ status: '200', result: booksUser })
// })

// app.post('/register_book', (req, res) => {
//     const { name, author, description, photo, profileid } = req.body
//     const bookOwner = profiles.find((profile) => profileid === profile.id)
//     if (
//         !name ||
//         !author ||
//         !description ||
//         !photo ||
//         !profileid ||
//         !bookOwner
//     ) {
//         return res.json({
//             status: '203',
//             message:
//                 'Nome do livro, o autor, a descrição, a imagem do livro e usuário são obrigatórios!',
//         })
//     }
//     const indexBookCreated = books.push({
//         id: `000${books.length + 1}`,
//         name,
//         author,
//         description,
//         photo,
//         profile: {
//             id: bookOwner.id,
//             userName: bookOwner.userName,
//         },
//     })
//     const bookCreated = [books[indexBookCreated - 1]]
//     return res.json({ status: '200', result: bookCreated })
// })