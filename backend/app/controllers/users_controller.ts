import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    data.password = await hash.make(data.password)
    const user = await User.create(data)
    return response.status(201).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }
}