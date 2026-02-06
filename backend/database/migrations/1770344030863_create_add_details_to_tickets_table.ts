import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // User Story - Le "Quoi" et le "Pourquoi"
      table.text('user_story').nullable()

      // Spécifications Techniques - Le "Comment"
      table.jsonb('technical_specs').nullable()

      // Critères d'Acceptation (Definition of Done)
      table.jsonb('acceptance_criteria').nullable()

      // Priorité
      table.enum('priority', ['low', 'medium', 'high', 'critical']).defaultTo('medium')

      // Ressources et liens
      table.jsonb('resources').nullable()

      // Notes additionnelles
      table.text('notes').nullable()

      // Estimation en heures
      table.integer('estimated_hours').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('user_story')
      table.dropColumn('technical_specs')
      table.dropColumn('acceptance_criteria')
      table.dropColumn('priority')
      table.dropColumn('resources')
      table.dropColumn('notes')
      table.dropColumn('estimated_hours')
    })
  }
}
