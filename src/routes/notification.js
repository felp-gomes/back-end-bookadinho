




module.exports = function(application){
    application.get('/notifications/:profileid' , function (req , res) {
        application.src.controller.notification.getNotifications( application, req , res )
    })
    application.post('/notifications/create_notification' , function (req , res) {
        application.src.controller.notification.createNotification( application , req ,res )
    })
}
