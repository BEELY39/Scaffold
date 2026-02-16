import Ticket from '#models/ticket'
import AiService from '#services/ai_service'
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

  /**
   * Enrichit un ticket avec les détails techniques (lazy loading)
   * POST /api/tickets/:id/enrich
   */
  async enrich({ params, auth, response }: HttpContext) {
    // Charger le ticket avec son projet
    const ticket = await Ticket.query()
      .where('id', params.id)
      .preload('project')
      .first()

    if (!ticket) {
      return response.status(404).json({ message: 'Ticket not found' })
    }

    // Vérifier ownership
    if (ticket.project.userId !== auth.user!.id) {
      return response.forbidden({ message: 'Accès non autorisé' })
    }

    // Skip si déjà enrichi (idempotence)
    if (ticket.technicalSpecs?.length && ticket.acceptanceCriteria?.length) {
      return response.json(ticket)
    }

    // Enrichir via IA
    const aiService = new AiService()
    const techStack = ticket.project.tech_stack?.join(', ') || ''

    try {
      const details = await aiService.enrichTicketDetails({
        title: ticket.title,
        description: ticket.description || '',
        userStory: ticket.userStory || '',
        techStack,
      })

      // Sauvegarder
      ticket.technicalSpecs = details.technicalSpecs
      ticket.acceptanceCriteria = details.acceptanceCriteria
      await ticket.save()

      return response.json(ticket)
    } catch (error) {
      console.error('Enrichment error:', error)
      return response.status(500).json({ message: 'Erreur lors de l\'enrichissement du ticket' })
    }
  }
}