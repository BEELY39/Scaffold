import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE')

      table.string('title').notNullable()
      table.text('description').nullable()

      table.enum('type', ['feature', 'bug', 'chore', 'spike'], {
        useNative: true,
        enumName: 'ticket_type',
        existingType: false,
      }).notNullable()

      table.enum('status', ['todo', 'in_progress', 'code_review', 'done'], {
        useNative: true,
        enumName: 'ticket_status',
        existingType: false,
      }).defaultTo('todo')

      table.integer('complexity').notNullable()
      table.integer('position').defaultTo(0)
      table.timestamp('completed_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS "ticket_type"')
    this.schema.raw('DROP TYPE IF EXISTS "ticket_status"')
  }
}