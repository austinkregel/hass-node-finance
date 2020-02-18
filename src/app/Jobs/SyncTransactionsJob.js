const plaid = require('plaid');
const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV],
    {version: '2019-05-29', clientApp: 'Node Finance'}
);
const dayjs = require('dayjs')
const Transaction = app.require('app/Transaction');
const Category = app.require('app/Category');
const AccessToken = app.require('app/AccessToken');

const promiseMe = (accessToken, startDate, endDate) =>
    new Promise((resolve, reject) => {
        var startDate = dayjs().subtract(30, 'days').format('YYYY-MM-DD');
        var endDate = dayjs().format('YYYY-MM-DD');
        client.getTransactions(accessToken.token, startDate, endDate, {
            count: 250,
            offset: 0,
        }, function (error, transactionsResponse) {
            if (error != null) {
                reject(error)
            } else {
                resolve(transactionsResponse)
            }
        });
    })
module.exports = class SyncTransactionsJob {
    static get getQueueName() {
        return 'plaid:sync-transactions';
    }

    /**
     * @param accessToken
     */
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.handle = this.handle.bind(this);
        this.toJson = this.toJson.bind(this);
        this.createOrUpdateTransaction = this.createOrUpdateTransaction.bind(this);
        this.createRelateAndSync = this.createRelateAndSync.bind(this);
    }

    async handle({ job, name }) {
        const { accessToken } = job.data;
        const { transactions } = await promiseMe(accessToken)

        await Promise.all(transactions.map(async transaction => {
            const transactionRecord = await this.createOrUpdateTransaction(transaction);
            await this.createRelateAndSync(transactionRecord, transaction.category)
        }));
        // Use the access token to get all the accounts from plaid.
        // Then dispatch more jobs to query all the transactions for those accounts.
    }

    toJson() {
        return {
            accessToken: this.accessToken
        };
    }

    async createOrUpdateTransaction(transaction) {
        let possibleTransaction = (await Transaction.query().where(builder => {
            builder.where('transaction_id', transaction.transaction_id);
            if (transaction.pending_transaction_id) {
                builder.orWhere('transaction_id', transaction.pending_transaction_id);
            }
        }))[0];

        if (possibleTransaction) {
            possibleTransaction.update({
                name: transaction.name,
                amount: transaction.amount,
                account_id: transaction.account_id,
                date: transaction.date,
                is_pending: transaction.pending,
                category_id:  transaction.category_id,
                transaction_id: transaction.pending_transaction_id || transaction.transaction_id,
                transaction_type: transaction.transaction_type,
            });
        } else {
            possibleTransaction = await Transaction.create({
                name: transaction.name,
                amount: transaction.amount,
                account_id: transaction.account_id,
                date: transaction.date,
                is_pending: transaction.pending,
                category_id: transaction.category_id,
                transaction_id: transaction.transaction_id,
                transaction_type: transaction.transaction_type,
            })
        }

        return await Transaction.query()
            .withGraphFetched('categories')
            .findById(possibleTransaction.id)
    }

    async createRelateAndSync(transactionRecord, categoryNames) {
        const categories = await Category.query().whereIn('name', categoryNames).groupBy('name');

        await Promise.all(categories.map(async category => {
            if (transactionRecord.categories.map(c => c.id).includes(category.id)) {
                return;
            }

            await transactionRecord.$relatedQuery('categories').relate(category)
        }))
    }
}
