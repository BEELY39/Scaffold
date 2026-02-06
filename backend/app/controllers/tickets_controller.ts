import Ticket from '#models/ticket'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketsController {
    async store({request, response}: HttpContext){
        const data = request.only([
            'title',
            'description',
            'projectId',
            'status',
            'type',
            'complexity',
            
        ])
        const ticket = await Ticket.create(data)
        return response.status(201).json(ticket)
    }
}