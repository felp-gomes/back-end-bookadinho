

const { profiles } = require('../../mocks/profiles.js');
const { books } = require('../../mocks/books.js');


function User() {}

User.prototype.login = async (req , res) => {
    return new Promise ((resolve) => {
        const {userName , password } = req.body;
        if(!userName || !password) {
            var result = {
                status : 403,
                message : 'Nome de usuário e senha Obrigatórios'
            }
            resolve(result)
        }
        else {
            const profile = profiles.find(
                (profile) => profile.userName == userName && profile.password === password
            );
            if(!profile) {
                result = {
                    status : 403,
                    message : 'Nome de usuário ou senha incorreta'
                }
                resolve(result)
            }
            else {
                result = {
                    status : 200,
                    result : profile
                }
                resolve(result)
            }
        }
    })
}

User.prototype.home = async (req , res) => {
    return new Promise ((resolve) => {
        const result = {
            status : 200,
            result : books
        }
        resolve(result)
    })
}


module.exports = function () {
    return User;
}