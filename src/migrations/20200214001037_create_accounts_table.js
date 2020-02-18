exports.up = async function(knex, Promise) {
    await knex.schema.createTable('accounts', function(table) {
        // User data.
        table.increments('id').unsigned().primary();
        table.string('account_id', 255).notNullable();
        table.integer('access_token_id', 10).unsigned();
        table.string('mask', 255).nullable();
        table.string('official_name', 255).nullable();
        table.string('name', 255).nullable();
        table.float('balance', 2).defaultTo(0.0);
        table.float('available', 2).defaultTo(0.0);
        table.string('subtype', 255).nullable();
        table.string('type', 255).nullable();
        table.boolean('is_favorite').defaultTo(false);
        table.boolean('is_hidden').defaultTo(false);

        // Timestamps.
        table.timestamps(true)
    });
    await knex.schema.createTable('account_users', function(table) {
        table.integer('user_id', 10).unsigned();
        // This would be the `id` field from the accounts table.
        table.integer('account_id', 10).unsigned();
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('accounts');
    await knex.schema.dropTable('account_users');
};
