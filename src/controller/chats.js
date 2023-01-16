



// app.get('/chats/preview/:profileid', (req, res) => {
//     const { profileid } = req.params
//     if (!profiles.some((profile) => profile.id === profileid)) {
//         return res.json({
//             status: '203',
//             message: 'O identificador do perfil é obrigatório',
//         })
//     }
//     const talks = chats.filter(
//         (chat) => chat.recipient === profileid || chat.sender === profileid
//     )
//     if (talks.length === 0) {
//         return res.json({ status: '200', result: talks })
//     }
//     const preview = talks.map((talk, index) => {
//         const { id, message, origin, time } =
//             talk.messages[talk.messages.length - 1]
//         const idContact =
//             talk.recipient === profileid ? talk.sender : talk.recipient
//         const { photo } = profiles.find((profile) => profile.id === idContact)
//         return {
//             id: `000${index + 1}`,
//             idChat: talk.id,
//             lastMessage: {
//                 id,
//                 message,
//                 origin,
//                 photo,
//                 time,
//             },
//         }
//     })
//     return res.json({ status: '200', result: preview })
// })



// app.get('/chats/:idChat', (req, res) => {
//     const { idChat } = req.params
//     const chat = chats.filter((chat) => chat.id === idChat)
//     return res.json(
//         chat.length > 0
//             ? { status: '200', result: chat }
//             : { status: '204', message: 'Chat não encontrado!' }
//     )
// })
