const AccessToken = app.require('app/AccessToken');
const SyncAccountsJob = app.require('app/Jobs/SyncAccountsJob');

module.exports = class TokensController {
    async index(req, res) {
        return await AccessToken.query().select(['id','user_id', 'created_at','updated_at']);
    }

    async refreshTheAccounts() {
        const tokens = await AccessToken.query();
        tokens.map(token => app.queue.dispatch(new SyncAccountsJob(token)));
        return 'OK'
    }
}