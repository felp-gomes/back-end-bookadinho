

const { chats } = require('../../mocks/chats.js');
const { profiles } = require('../../mocks/profiles.js');

function Chat() {}

Chat.prototype.getChatsPreview = async (req , res) => {
    return new Promise ((resolve) => {
        const { profileid } = req.params;
        if (!profiles.some((profile) => profile.id === profileid)) {
            result = {
                status: '203',
                message: 'O identificador do perfil é obrigatório',
            }
            resolve(result)
        }
        const talks = chats.filter(
            (chat) => chat.recipient === profileid || chat.sender === profileid
        )
        if (talks.length === 0) {
            result = {
                status: '200',
                result: talks
            }
            resolve(result)
        }
        const preview = talks.map((talk, index) => {
            const { id, message, origin, time } =
                talk.messages[talk.messages.length - 1]
            const idContact =
                talk.recipient === profileid ? talk.sender : talk.recipient
            const { photo } = profiles.find((profile) => profile.id === idContact)
            return {
                id: `000${index + 1}`,
                idChat: talk.id,
                lastMessage: {
                    id,
                    message,
                    origin,
                    photo,
                    time,
                },
            }
        })
        result = {
            status: '200',
            result: preview
        }
        resolve(result)
    })
}

Chat.prototype.getChatsByID = async (req , res) => {
    return new Promise ((resolve) => {
        const { idChat } = req.params
        const chat = chats.filter((chat) => chat.id === idChat)
        if(chat.length > 0) {
            result = {
                status: '200',
                result: chat
            }
            resolve(result)
        } else {
            result = {
                status: '204',
                message: 'Chat não encontrado!'
            }
            resolve(result)
        }
    })
}

module.exports = function (){
    return Chat;
}
