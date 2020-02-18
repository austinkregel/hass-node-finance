const Model = require('./Model');

module.exports = class Transaction extends Model {
    fillable() {
        return [
            'account_id',
            'amount',
            'date',
            'name',
            'pending',
            'transaction_id',
            'transaction_type',
        ]
    }

    static get relationMappings() {
        const Account = app.require('app/Account');
        const Category = app.require('app/Category');

        return {
            account: {
                relation: Model.BelongsToOneRelation,
                modelClass: Account,
                join: {
                    from: 'transactions.account_id',
                    to: 'accounts.account_id',
                }
            },

            categories: {
                relation: Model.ManyToManyRelation,
                modelClass: Category,
                join: {
                    from: 'transactions.id',
                    through: {
                        from: 'category_transactions.transaction_id',
                        to: 'category_transactions.category_id'
                    },
                    to: 'categories.id'
                }
            }
        }
    }
}
