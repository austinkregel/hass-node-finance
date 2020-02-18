exports.up = async function(knex, Promise) {
    await knex.schema.createTable('users', function(table) {
        // User data.
        table.increments('id').unsigned().primary();
        table.string('name', 255).notNullable();

        // Login credentials.
        table.string('email').nullable().index();
        table.string('password', 128).nullable();

        // Timestamps.
        table.timestamps(true)
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.dropTable('users');
};
