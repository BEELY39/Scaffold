import Ticket from '#models/ticket'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketsController {
  async index({ response }: HttpContext) {
    const tickets = await Ticket.all()
    return response.json(tickets)
  }

  async show({ params, response }: HttpContext) {
    const ticket = await Ticket.find(params.id)
    if (!ticket) {
      return response.status(404).json({ message: 'Ticket not found' })
    }
    return response.json(ticket)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only([
      'title',
      'description',
      'userStory',
      'technicalSpecs',
      'acceptanceCriteria',
      'projectId',
      'status',
      'type',
      'priority',
      'complexity',
      'position',
      'estimatedHours',
      'resources',
      'notes',
    ])
    const ticket = await Ticket.create(data)
    return response.status(201).json(ticket)
  }

  async update({ params, request, response }: HttpContext) {
    const ticket = await Ticket.find(params.id)
    if (!ticket) {
      return response.status(404).json({ message: 'Ticket not found' })
    }
    const data = request.only([
      'title',
      'description',
      'userStory',
      'technicalSpecs',
      'acceptanceCriteria',
      'status',
      'type',
      'priority',
      'complexity',
      'position',
      'estimatedHours',
      'resources',
      'notes',
    ])
    ticket.merge(data)
    await ticket.save()
    return response.json(ticket)
  }

  async destroy({ params, response }: HttpContext) {
    const ticket = await Ticket.find(params.id)
    if (!ticket) {
      return response.status(404).json({ message: 'Ticket not found' })
    }
    await ticket.delete()
    return response.status(204).json(null)
  }

  async byProject({ params, response }: HttpContext) {
    const tickets = await Ticket.query()
      .where('projectId', params.projectId)
      .orderBy('position', 'asc')
    return response.json(tickets)
  }
}