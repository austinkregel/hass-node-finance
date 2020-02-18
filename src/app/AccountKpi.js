const Model = require('./Model')

module.exports = class AccountKpi extends Model {
    static get tableName() {
        return 'account_kpis';
    }

    fillable() {
        return [
            'account_id',
            'balance',
            'available',
            'total_transactions',
            'transaction_count_positive',
            'transaction_count_negative',
            'transaction_sum_positive',
            'transaction_sum_negative',
            'date',
        ]
    }
}
