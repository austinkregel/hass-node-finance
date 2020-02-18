const plaid = require('plaid');
const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Node Finance'}
);

const AccessToken = app.require('app/AccessToken');
const SyncAccountsJob = app.require('app/Jobs/SyncAccountsJob')
const exchange = (token) => new Promise((resolve, reject)  => client.exchangePublicToken(token, (error, response) => {
        if (error) {
            return reject(error);
        }

        resolve(response);
    }));


module.exports = class PlaidController {
    async exchange(req, res) {
        const PUBLIC_TOKEN = req.body.public_token;
        try {
            const tokenResponse = await exchange(PUBLIC_TOKEN);

            const ACCESS_TOKEN = tokenResponse.access_token;
            const ITEM_ID = tokenResponse.item_id;

            try {
                let accessToken = await AccessToken.query().insert({
                    token: ACCESS_TOKEN,
                    user_id: 1 // TODO: need to find the right way to get the user from the session
                })

                const syncAccountsJob = new SyncAccountsJob(accessToken);

                app.queue.dispatch(syncAccountsJob);
            } catch (e) {
                console.error(e);
            }

            res.json({
                access_token: ACCESS_TOKEN,
                item_id: ITEM_ID,
                error: null,
            });
        } catch (error) {
            res.json({
                error: error,
            });
        }
    }
}
