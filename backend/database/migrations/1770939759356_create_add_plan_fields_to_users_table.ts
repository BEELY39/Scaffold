import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('plan_type').defaultTo('free').notNullable()
      table.integer('ai_generations_this_month').defaultTo(0).notNullable()
      table.integer('ai_generations_limit').defaultTo(2).notNullable()
      table.timestamp('billing_period_start').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('plan_type')
      table.dropColumn('ai_generations_this_month')
      table.dropColumn('ai_generations_limit')
      table.dropColumn('billing_period_start')
    })
  }
}
