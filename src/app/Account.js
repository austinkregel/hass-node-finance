const Model = require('./Model')

module.exports = class Account extends Model {
    fillable() {
        return [
            'account_id',
            'mask',
            'name',
            'official_name',
            'balance',
            'available',
            'subtype',
            'type',
            'access_token_id',
            'is_favorite',
            'is_hidden',
        ]
    }

    static get relationMappings() {
        const Transaction = app.require('app/Transaction');

        return {
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: Transaction,
                join: {
                    from: 'accounts.account_id',
                    to: 'transactions.account_id'
                }
            }
        }
    }
}
