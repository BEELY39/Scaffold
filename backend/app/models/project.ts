import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ticket from '#models/ticket'
import user from '#models/user'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name : string

  @column()
  declare description: string | null

  @column()
  declare tech_stack: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(()=> user)
  declare user : BelongsTo<typeof user>

  @hasMany(()=> ticket)
  declare tickets : HasMany<typeof ticket>
}