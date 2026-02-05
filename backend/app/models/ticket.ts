import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  
  @column()
  declare projectId : number
  
  @column()
  declare title : string

  @column()
  declare description : string | null

  @column()
  declare status : 'todo' | 'in_progress'| 'code_review' | 'done'

  @column()
  declare type: 'feature' | 'bug' |'chore' | 'spike'
  
  @column()
  declare complexity : number

  @column()
  declare position : number
  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(()=> Project)
  declare project : BelongsTo<typeof Project>
}