exports.up = async function(knex, Promise) {
    await knex.schema.createTable('account_kpis', function(table) {
        table.string('account_id');
        table.float('balance', 2).defaultTo(0.0);
        table.float('available', 2).defaultTo(0.0);
        table.integer('total_transactions');
        table.integer('transaction_count_positive');
        table.integer('transaction_count_negative');
        table.float('transaction_sum_positive', 2);
        table.float('transaction_sum_negative', 2);
        table.date('date');
        table.timestamps(true)
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('account_kpis');

};
