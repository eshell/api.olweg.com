
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events', function (t) {
      t.increments('eid')
      t.integer('mid')
      t.integer('lid')
      t.date('date')
      t.time('time')
      t.string('title')
      t.string('description')
      t.string('address')
      t.string('city')
      t.string('state')
      t.string('zip')
      t.timestamps()
    }),
    knex.schema.createTable('audio', function (t) {
      t.increments('aid')
      t.integer('mid')
      t.string('title')
      t.string('src')
      t.timestamps()
    }),
    knex.schema.createTable('errors', function (t) {
      t.increments()
      t.string('description')
      t.timestamps()
    }),
    knex.schema.createTable('members', function (t) {
      t.increments('mid')
      t.integer('ref_id')
      t.string('email')
      t.string('password')
      t.integer('type')
      t.string('img')
      t.string('name')
      t.string('address')
      t.string('city')
      t.string('state')
      t.string('zip')
      t.integer('verified')
      t.timestamps()
    }),
    knex.schema.createTable('genres', function (t) {
      t.increments('gid')
      t.string('genre')
      t.integer('verified')
      t.timestamps()
    }),
    knex.schema.createTable('members_genres', function (t) {
      t.integer('mid')
      t.integer('gid')
    }),
    knex.schema.createTable('members_events', function (t) {
      t.integer('mid')
      t.integer('eid')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events'),
    knex.schema.dropTable('members'),
    knex.schema.dropTable('genres'),
    knex.schema.dropTable('members_genres'),
    knex.schema.dropTable('members_events'),
    knex.schema.dropTable('audio'),
    knex.schema.dropTable('errors')
  ])
}
