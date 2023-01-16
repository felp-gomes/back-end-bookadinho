



// app.get('/notifications/:profileid', (req, res) => {
//     const { profileid } = req.params
//     if (!profiles.some((profile) => profile.id === profileid)) {
//         return res.json({
//             status: '203',
//             message: 'O identificador do perfil é obrigatório!',
//         })
//     }
//     const notices = notifications.filter(
//         (notification) => notification.recipient.id === profileid
//     )
//     return res.json({ status: '200', result: notices })
// })


// app.post('/notifications/create_notification', (req, res) => {
//     const { sender = {}, recipient = {}, type } = req.body
//     if (
//         !profiles.some((profile) => profile.id === recipient.id) ||
//         !profiles.some((profile) => profile.id === sender.id)
//     ) {
//         return res.json({
//             status: '203',
//             message: 'O identificador do perfil é obrigatório!',
//         })
//     }
//     if (type !== 'follow' && type !== 'message') {
//         return res.json({
//             status: '203',
//             message: 'Tipo de notificação obrigatório!',
//         })
//     }

//     const indexNotificationCreated = notifications.push({
//         id: `000${books.length + 1}`,
//         sender,
//         recipient,
//         type,
//         time,
//     })
//     const notificationCreated = [notifications[indexNotificationCreated - 1]]
//     return res.json({ status: '200', result: notificationCreated })
// })