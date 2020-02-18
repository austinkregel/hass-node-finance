const Account = app.require('app/Account');
const AccountKpi = app.require('app/AccountKpi');

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

module.exports = class AccountsController {
    async index(req, res) {
        const query = req.query || { filter : {}};
        const wheres = Object.keys(query.filter   || {}).map(key => ([
            key,
            ...expandValue(query.filter[key])
        ]));

        let dbQuery = Account.query();

        for (let index in wheres) {
            dbQuery = dbQuery.where(...wheres[index]);
        }

        return await dbQuery;
    }

    async patch(req, res) {
        const account = await Account.query().findById(req.params.account);

        if (!account) {
            res.status(404);
            return {
                message: 'No account found.'
            }
        }

        account.update(req.body || {})

        return account;
    }

    async showKpi(req, res) {
        const query = req.query || { filter : {}};
        const wheres = Object.keys(query.filter   || {}).map(key => ([
            key,
            ...expandValue(query.filter[key])
        ]));

        let dbQuery = AccountKpi.query();

        for (let index in wheres) {
            dbQuery = dbQuery.where(...wheres[index]);
        }
        dbQuery = dbQuery.where('account_id', req.params.account);

        return await dbQuery;
    }
}