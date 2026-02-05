import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
async store({request, response}: HttpContext){
    const data = request.only(['name','description','userId','tech_stack'])
    const project = await Project.create(data)
    return response.status(201).json(project)
}
    
}