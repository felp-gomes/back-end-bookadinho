

const { profiles } = require('../../mocks/profiles.js');

function Profile () {}

Profile.prototype.getSalvos = async (req , res) => {
    return new Promise ((resolve) => {
        result =  {
            status: '200',
            result: 'Rota de Salvos'
        }
        resolve(result)
    })
}

Profile.prototype.getProfile = async (req , res) => {
    return new Promise((resolve) => {
        result = {
            status: '200',
            result: profiles
        }
        resolve(result)
    })
}

Profile.prototype.getProfileById = async (req , res) => {
    return new Promise((resolve) => {
        const { profileid } = req.params
        const profile = profiles.filter((profile) => profileid === profile.id)
        if(profile.lenght > 0) {
            result = {
                status: '200',
                result: profile
            }
            resolve(result)
        } else {
            result = {
                status: '204',
                message: 'Perfil não encontrado!'
            }
            resolve(result)
        }
    })
}

Profile.prototype.createProfile = async (req , res) => {
    return new Promise((resolve) => {
        const {
        name,
        userName,
        description = '',
        likes = [],
        changeBooks = [],
        latestReadings = [],
        photo = '',
        password,
        } = req.body

        if (!name || !userName || !password) {
            result = {
                status: '203',
                message: 'Nome e nome de usuário são obrigatórios!'
            }
            resolve(result)
        }

        if (profiles.some((profile) => userName === profile.userName)) {
            result = {
                status: '203',
                message: 'Nome de usuário já existente!'
            }
            resolve(result)
        }

        const indexPerfilCreated = profiles.push({
            id: `000${profiles.length + 1}`,
            name,
            userName,
            description,
            likes,
            changeBooks,
            latestReadings,
            photo,
            password,
        })
        const perfilCreated = [profiles[indexPerfilCreated - 1]]
        result = {
            status: '200',
            result: perfilCreated
        }
        resolve(result)
    })
}

Profile.prototype.editProfile = async ( req , res) => {
    return new Promise ((resolve) => {
        const { profileid, userName, description, photo, likes, latestReadings } = req.body
        if (
            !profiles.some((profile) => profile.id === profileid) ||
            !description ||
            !userName ||
            !photo ||
            !likes ||
            !latestReadings
        ) {
            result = {
                status: '203',
                message: 'O identificador, a descrição, o nome de usuário, a foto e os gostos são obrigatórios!'
            }
            resolve(result)
        } else {
            let indexProfile = 0
            const profile = profiles.find((profile, index) => {
                if (profile.id === profileid) {
                    indexProfile = index
                    return profile.id === profileid
                }
            })
            profile.userName = userName
            profile.description = description
            profile.photo = photo
            profile.likes = likes
            profile.latestReadings = latestReadings
            profiles[indexProfile] = profile
            result = {
                status: '200',
                result: [profile]
            }
            resolve(result)
        }
        
    })
}

module.exports = function () {
    return Profile
}



// app.get('/salvos/:perfilid', (req, res) => {
//     res.send('Rota de salvos')
// })



// const editProfile = async (req , res) => {
//     const { profileid, userName, description, photo, likes, latestReadings } =
//         req.body
//     if (
//         !profiles.some((profile) => profile.id === profileid) ||
//         !description ||
//         !userName ||
//         !photo ||
//         !likes ||
//         !latestReadings
//     ) {
//         return res.json({
//             status: '203',
//             message:
//                 'O identificador, a descrição, o nome de usuário, a foto e os gostos são obrigatórios!',
//         })
//     }
//     let indexProfile = 0
//     const profile = profiles.find((profile, index) => {
//         if (profile.id === profileid) {
//             indexProfile = index
//             return profile.id === profileid
//         }
//     })
//     profile.userName = userName
//     profile.description = description
//     profile.photo = photo
//     profile.likes = likes
//     profile.latestReadings = latestReadings
//     profiles[indexProfile] = profile
//     return res.status(200).json(
//         { status: '200', result: [profile] })
// }

// app.get('/profiles', (req, res) => {
//     return res.json({ status: '200', result: profiles })
// })

// app.get('/profiles/:profileid', (req, res) => {
//     const { profileid } = req.params
//     const profile = profiles.filter((profile) => profileid === profile.id)
//     return res.json(
//         profile.length > 0
//             ? { status: '200', result: profile }
//             : { status: '204', message: 'Perfil não encontrado!' }
//     )
// })

// app.post('/create_profile', (req, res) => {
//     const {
//         name,
//         userName,
//         description = '',
//         likes = [],
//         changeBooks = [],
//         latestReadings = [],
//         photo = '',
//         password,
//     } = req.body
//     if (!name || !userName || !password) {
//         return res.json({
//             status: '203',
//             message: 'Nome e nome de usuário são obrigatórios!',
//         })
//     }

//     if (profiles.some((profile) => userName === profile.userName)) {
//         return res.json({
//             status: '203',
//             message: 'Nome de usuário já existente!',
//         })
//     }

//     const indexPerfilCreated = profiles.push({
//         id: `000${profiles.length + 1}`,
//         name,
//         userName,
//         description,
//         likes,
//         changeBooks,
//         latestReadings,
//         photo,
//         password,
//     })
//     const perfilCreated = [profiles[indexPerfilCreated - 1]]
//     return res.json({ status: '200', result: perfilCreated })
// })



// module.exports = {
//     editProfile,
// }