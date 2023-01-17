

module.exports = function (application) {
    application.get('/chats/preview/:profileid' , (req , res) => {
        application.src.controller.chat.getChatsPreview(application , req , res)
    });
    application.get('/chats/:idChat' , (req  , res) => {
        application.src.controller.chat.getChatsByID(application, req , res)
    })
}