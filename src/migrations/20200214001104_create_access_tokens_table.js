exports.up = async function(knex, Promise) {
    await knex.schema.createTable('access_tokens', function(table) {
        // User data.
        table.increments('id').unsigned().primary();
        table.integer('user_id', 10).unsigned();
        table.string('token', 255).notNullable();

        // Timestamps.
        table.timestamps(true)
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('access_tokens');
};
