import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json(
      users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    )
  }

  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    return response.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

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

  async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    const data = request.only(['fullName', 'email', 'password'])
    if (data.password) {
      data.password = await hash.make(data.password)
    }
    user.merge(data)
    await user.save()
    return response.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }
    await user.delete()
    return response.status(204).json(null)
  }
}