const Transaction = app.require('app/Transaction');
const AccessToken = app.require('app/AccessToken');
const SyncTransactionsJob = app.require('app/Jobs/SyncTransactionsJob');

const expandValue = (value) => {
    const possibleComparator = value.split(':', 2);

    if (possibleComparator.length > 1) {
        possibleComparator[1] = ['in', 'notin'].includes(possibleComparator[0].toLowerCase())
            ? possibleComparator[1].split(',')
            : possibleComparator[1];

        return possibleComparator
    }

    return ['=', value];
}

module.exports = class TransactionController {
    async index(req, res) {
        console.log('request')
        const query = req.query || {filter: {}, include: ''};
        const wheres = Object.keys(query.filter || {}).map(key => ([
            key,
            ...expandValue(query.filter[key])
        ]));

        let dbQuery = Transaction.query().orderBy('created_at', 'desc');

        for (let index in wheres) {
            dbQuery = dbQuery.where(...wheres[index]);
        }

        dbQuery = dbQuery
                .withGraphFetched({
                    categories: true,
                    account: true
                })

        // dbQuery = dbQuery.paginate((req.query.limit || 15), (req.query.page || 1));
        return await dbQuery
    }

    async refreshTheTransactions(req, res) {
        const tokens = await AccessToken.query();
        tokens.map(token => app.queue.dispatch(new SyncTransactionsJob(token)));
        return 'OK'
    }
}