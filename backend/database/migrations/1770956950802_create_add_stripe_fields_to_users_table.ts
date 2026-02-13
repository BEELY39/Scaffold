import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('stripe_customer_id').nullable().unique()
      table.string('stripe_subscription_id').nullable()
      table.string('subscription_status').nullable() // 'active', 'canceled', 'past_due'
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stripe_customer_id')
      table.dropColumn('stripe_subscription_id')
      table.dropColumn('subscription_status')
    })
  }
}
