exports.up = async function(knex, Promise) {
    await knex.schema.createTable('categories', function(table) {
        // User data.
        table.increments('id').unsigned().primary();
        table.string('name').index();
        // This is the category id from Plaid.
        table.integer('category_id').index();
        // Timestamps.
        table.timestamps(true)
    });
    await knex.schema.createTable('category_transactions', function(table) {
        // User data.
        table.increments('id').unsigned().primary();

        table.bigInteger('category_id').unsigned();
        table.bigInteger('transaction_id').unsigned();
        // Timestamps.
        table.timestamps(true)
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('categories');
    await knex.schema.dropTable('category_transactions');
};
