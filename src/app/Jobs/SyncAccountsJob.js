const plaid = require('plaid');
const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Node Finance'}
);
const Account = app.require('app/Account')
const promiseMe = (accessToken) =>
    new Promise((resolve, reject) =>
        client.getAccounts(accessToken.token, (err, response) => {
            if (err) {
                reject(err)
            }
            resolve(response)
        })
    )
module.exports = class SyncAccountsJob {
    static get getQueueName() {
        return 'plaid:sync-accounts';
    }
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    async handle({ job, name }) {
        const { accessToken } = job.data;
        const { accounts } = await promiseMe(accessToken)

        await Promise.all(accounts.map(async account => {
            const possibleAccount = (await Account.query().where('account_id', account.account_id))[0]

            if (possibleAccount) {
                possibleAccount.update({
                    mask: account.mask,
                    official_name: account.official_name,
                    name: account.name,
                    balance: account.balances.current,
                    available: account.balances.available,
                    subtype: account.subtype,
                    type: account.type,
                });

                return;
            }

            await Account.create({
                account_id: account.account_id,
                access_token_id: accessToken.id,
                mask: account.mask,
                official_name: account.official_name,
                name: account.name,
                balance: account.balances.current,
                available: account.balances.available,
                subtype: account.subtype,
                type: account.type,
            })
        }));
        // Use the access token to get all the accounts from plaid.
        // Then dispatch more jobs to query all the transactions for those accounts.
    }

    toJson() {
        return {
            accessToken: this.accessToken
        };
    }
}
