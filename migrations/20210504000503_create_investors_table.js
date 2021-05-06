exports.up = (knex, Promise) => knex.schema.createTable(
  'investors', (table) => {
    table.increments('id');
    table.string('email')
      .notNullable();
    table.decimal('investment_amount', 12, 2)
      .notNullable();
    table.integer('project_id')
      .unsigned()
      .notNullable();
    // or: table.foreign('project_id').references('MyDb.projects.id')
    table.timestamp('created_at')
      .defaultTo(knex.fn.now());
    table.timestamp('updated_at')
      .defaultTo(knex.fn.now());
  });

exports.down = (knex, Promise) => knex.schema.dropTable('investors');
