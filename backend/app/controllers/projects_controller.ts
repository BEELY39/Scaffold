import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Ticket from '#models/ticket'
import AiService from '#services/ai_service'
import { UsageService } from '#services/usage_service'

export default class ProjectsController {
  async index({ response, auth }: HttpContext) {
    const projects = await Project.query()
      .where('userId', auth.user!.id)
      .preload('tickets')
    return response.json(projects)
  }

  async show({ params, response, auth }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .preload('tickets')
      .first()

    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }

    return response.json(project)
  }

  async store({ request, response, auth }: HttpContext) {
    const body = request.only(['name', 'description', 'techStack', 'hasBackend', 'backendStack'])

    // Combiner frontend stack + backend stack
    const allTechs = [
      ...(body.techStack || []),
      ...(body.backendStack || []),
    ]

    const project = await Project.create({
      name: body.name,
      description: body.description,
      tech_stack: allTechs.length > 0 ? allTechs : [],
      userId: auth.user!.id,
    })
    return response.status(201).json(project)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .first()

    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }

    const data = request.only(['name', 'description', 'tech_stack'])
    project.merge(data)
    await project.save()
    return response.json(project)
  }

  async destroy({ params, response, auth }: HttpContext) {
    const project = await Project.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .first()

    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }

    await project.delete()
    return response.status(204).json(null)
  }

  /**
   * Crée un projet ET génère les tickets via IA en une seule requête
   * Si l'IA échoue, le projet est supprimé (rollback)
   */
  async storeWithTickets({ request, response, auth }: HttpContext) {
    const usageService = new UsageService()

    // Vérifier la limite AVANT de créer le projet
    const usage = await usageService.canGenerate(auth.user!)

    if (!usage.allowed) {
      return response.status(402).json({
        error: 'limit_exceeded',
        message: `Limite mensuelle atteinte (${usage.limit}/${usage.limit} générations). Passez au plan Pro pour des générations illimitées.`,
        usage: {
          used: usage.used,
          limit: usage.limit,
          remaining: 0,
          resetDate: usage.resetDate.toISO(),
        },
      })
    }

    const body = request.only(['name', 'description', 'techStack', 'hasBackend', 'backendStack'])

    // Combiner frontend stack + backend stack pour l'IA
    const allTechs = [
      ...(body.techStack || []),
      ...(body.backendStack || []),
    ]

    // Créer le projet
    const project = await Project.create({
      name: body.name,
      description: body.description,
      tech_stack: allTechs.length > 0 ? allTechs : [],
      userId: auth.user!.id,
    })

    try {
      // Générer les tickets via IA
      const aiService = new AiService()
      const generatedTickets = await aiService.generateTickets({
        projectName: project.name,
        projectDescription: project.description || '',
        techStack: (project.tech_stack as string[]) || [],
      })

      // Créer les tickets SANS technicalSpecs/acceptanceCriteria (lazy loading)
      const tickets = await Promise.all(
        generatedTickets.map((ticketData) =>
          Ticket.create({
            projectId: project.id,
            title: ticketData.title,
            description: ticketData.description,
            userStory: ticketData.userStory,
            // technicalSpecs et acceptanceCriteria sont générés à la demande (lazy loading)
            technicalSpecs: null,
            acceptanceCriteria: null,
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

      // Incrémenter le compteur après succès
      await usageService.trackGeneration(auth.user!)

      return response.status(201).json({ project, tickets })
    } catch (error) {
      // Si IA échoue, supprimer le projet (rollback)
      await project.delete()
      return response.status(500).json({
        message: 'Échec de la génération IA. Projet annulé.',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async generateTickets({ params, response, auth }: HttpContext) {
    const usageService = new UsageService()

    // Vérifier la limite AVANT de générer
    const usage = await usageService.canGenerate(auth.user!)

    if (!usage.allowed) {
      return response.status(402).json({
        error: 'limit_exceeded',
        message: `Limite mensuelle atteinte (${usage.limit}/${usage.limit} générations). Passez au plan Pro pour des générations illimitées.`,
        usage: {
          used: usage.used,
          limit: usage.limit,
          remaining: 0,
          resetDate: usage.resetDate.toISO(),
        },
      })
    }

    const project = await Project.query()
      .where('id', params.id)
      .where('userId', auth.user!.id)
      .first()

    if (!project) {
      return response.status(404).json({ message: 'Project not found' })
    }

    const aiService = new AiService()

    try {
      const generatedTickets = await aiService.generateTickets({
        projectName: project.name,
        projectDescription: project.description || '',
        techStack: (project.tech_stack as string[]) || [],
      })

      // Créer les tickets SANS technicalSpecs/acceptanceCriteria (lazy loading)
      const tickets = await Promise.all(
        generatedTickets.map((ticketData) =>
          Ticket.create({
            projectId: project.id,
            title: ticketData.title,
            description: ticketData.description,
            userStory: ticketData.userStory,
            // technicalSpecs et acceptanceCriteria sont générés à la demande (lazy loading)
            technicalSpecs: null,
            acceptanceCriteria: null,
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

      // Incrémenter le compteur après succès
      await usageService.trackGeneration(auth.user!)

      return response.status(201).json(tickets)
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to generate tickets',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Retourne l'usage de l'utilisateur (générations restantes, etc.)
   */
  async getUsage({ response, auth }: HttpContext) {
    const usageService = new UsageService()
    const usage = await usageService.canGenerate(auth.user!)

    return response.json({
      planType: auth.user!.planType,
      used: usage.used,
      limit: usage.limit,
      remaining: usage.remaining,
      resetDate: usage.resetDate.toISO(),
    })
  }
}