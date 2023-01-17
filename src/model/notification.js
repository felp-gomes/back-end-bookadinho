


const { notifications } = require('../../mocks/notifications.js')
const { profiles } = require('../../mocks/profiles.js')


function Notification() {}


Notification.prototype.getNotifications = async (req, res) => {
    return new Promise((resolve) => {
        const { profileid } = req.params;
        if (!profiles.some((profile) => profile.id === profileid)) {
            result = {
                status: '203',
                message: 'O identificador do perfil é obrigatório!',
            }
            resolve(result)
        } else {
            const notices = notifications.filter(
                (notification) => notification.recipient.id === profileid
            )
            result = {
                status: '200',
                result: notices
            }
            resolve(result)
        }
    })
}

Notification.prototype.createNotification = async (req , res) => {
    return new Promsise((resolve) => {
    const { sender = {}, recipient = {}, type } = req.body
    if (
        !profiles.some((profile) => profile.id === recipient.id) ||
        !profiles.some((profile) => profile.id === sender.id)
    ) {
        result = {
            status: '203',
            message: 'O identificador do perfil é obrigatório!',
        }
        resolve(result)
    }
    if (type !== 'follow' && type !== 'message') {
        result = {
            status: '203',
            message: 'Tipo de notificação obrigatório!'
        }
        resolve(result)
    }

    const indexNotificationCreated = notifications.push({
        id: `000${books.length + 1}`,
        sender,
        recipient,
        type,
        time,
    })
    const notificationCreated = [notifications[indexNotificationCreated - 1]]
    result = {
        status: '200',
        result: notificationCreated
    }
    resolve(result)
    })
}

module.exports = function() {
    return Notification
}