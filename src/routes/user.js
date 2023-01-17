



module.exports = function (application) {
    application.post('/login' , function (req , res) {
        application.src.controller.user.login(application, req , res );
    });

    application.get('/home' , function ( req , res) {
        application.src.controller.user.home(application, req , res)
    })
}