



// app.post('/login', (req, res) => {
//     console.log('req.body', req.body)
//     const { userName, password } = req.body
//     if (!userName || !password) {
//         return res.json({
//             status: '403',
//             message: 'Nome de usuário e senha obrigatórios',
//         })
//     }

//     const profile = profiles.find(
//         (profile) => profile.userName == userName && profile.password === password
//     )

//     if (!profile) {
//         return res.json({
//             status: '403',
//             message: 'Nome de usuário ou senha incorreta',
//         })
//     }

//     return res.json({ status: '200', result: profile })
// })



// app.get('/home', (req, res) => {
//     return res.json({ status: '200', result: books })
// })