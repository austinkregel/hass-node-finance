exports.up = async function(knex, Promise) {
    await knex.schema.createTable('transactions', function(table) {
        // User data.
        table.increments('id').unsigned().primary();

        table.string('name', 255).nullable().index()
        table.float('amount', 2).defaultTo(0.0).nullable();
        table.string('account_id').nullable();
        table.dateTime('date').nullable();
        table.boolean('is_pending').nullable();
        table.integer('category_id').unsigned().nullable();
        table.string('transaction_id').nullable();
        table.string('transaction_type').nullable();
        // Timestamps.
        table.timestamps(true)
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('transactions');
};
