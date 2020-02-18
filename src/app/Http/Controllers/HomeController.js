module.exports = class HomeController {
    async index(req, res) {
        return await app.view.render('home')
    }

    async spaRoute(req, res) {
        return await app.view.render('spa', {
            auth() {
                return req.user;
            },
        })
    }
}