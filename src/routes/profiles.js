


module.exports = function (application) {

    application.get('/salvos/:perfilid' , function (req , res) {
        application.src.controller.profile.getSalvos(application , req , res)
    })
    application.get('/profiles' , function (req , res) {
        application.src.controller.profile.getProfile(application , req , res)
    })
    application.get('/profiles/:profileid' , function (req , res) {
        application.src.controller.profile.getProfileById(application , req , res)
    })
    application.put('/profiles/edit_profile' , function (req , res) {
        application.src.controller.profile.editProfile(application, req , res)
    })
    application.post('/create_profile' , function (req , res) {
        application.src.controller.profile.createProfile(application, req , res)
    })
}