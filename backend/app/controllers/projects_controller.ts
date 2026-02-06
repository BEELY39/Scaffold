import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Ticket from '#models/ticket'
import AiService from '#services/ai_service'

export default class ProjectsController {
  async index({ response }: HttpContext) {
    const projects = await Project.query().preload('tickets')
    return response.json(projects)
  }

  async show({ params, response }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .preload('tickets')
      .first()
    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }
    return response.json(project)
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'userId', 'tech_stack'])
    const project = await Project.create(data)
    return response.status(201).json(project)
  }

  async update({ params, request, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }
    const data = request.only(['name', 'description', 'tech_stack'])
    project.merge(data)
    await project.save()
    return response.json(project)
  }

  async destroy({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }
    await project.delete()
    return response.status(204).json(null)
  }

  async generateTickets({ params, response }: HttpContext) {
    const project = await Project.find(params.id)
    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }

    const aiService = new AiService()

    try {
      const generatedTickets = await aiService.generateTickets({
        projectName: project.name,
        projectDescription: project.description || '',
        techStack: (project.tech_stack as Record<string, string>) || {},
      })

      const tickets = await Promise.all(
        generatedTickets.map((ticketData) =>
          Ticket.create({
            projectId: project.id,
            title: ticketData.title,
            description: ticketData.description,
            userStory: ticketData.userStory,
            technicalSpecs: ticketData.technicalSpecs,
            acceptanceCriteria: ticketData.acceptanceCriteria,
            type: ticketData.type,
            priority: ticketData.priority,
            complexity: ticketData.complexity,
            position: ticketData.position,
            estimatedHours: ticketData.estimatedHours,
            notes: ticketData.notes,
            status: 'todo',
          })
        )
      )

      return response.status(201).json(tickets)
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to generate tickets',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}