import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  // User Story - Le "Quoi" et le "Pourquoi"
  @column()
  declare userStory: string | null

  // Spécifications Techniques - Le "Comment"
  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare technicalSpecs: string[] | null

  // Critères d'Acceptation (Definition of Done)
  @column({
    prepare: (value: string[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare acceptanceCriteria: string[] | null

  @column()
  declare status: 'todo' | 'in_progress' | 'code_review' | 'done'

  @column()
  declare type: 'feature' | 'bug' | 'chore' | 'spike'

  @column()
  declare priority: 'low' | 'medium' | 'high' | 'critical'

  @column()
  declare complexity: number

  @column()
  declare position: number

  // Estimation en heures
  @column()
  declare estimatedHours: number | null

  // Ressources et liens (Figma, API docs, etc.)
  @column({
    prepare: (value: { type: string; url: string; label: string }[] | null) =>
      value ? JSON.stringify(value) : null,
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare resources: { type: string; url: string; label: string }[] | null

  // Notes additionnelles
  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}