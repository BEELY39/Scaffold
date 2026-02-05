import { test } from '@japa/runner'
import User from '#models/user'
import Project from '#models/project'
import db from '@adonisjs/lucid/services/db'

test.group('Models Integrity', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    return () => db.rollbackGlobalTransaction()
  })

  test('should create a project linked to a user', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Daniel Dev',
      email: 'daniel@metron.com',
      password: 'password123'
    })

    const project = await Project.create({
      userId: user.id,
      name: 'Metron',
      description: 'Compliance-as-a-Service',
      tech_stack: {
        frontend: 'Angular',
        backend: 'AdonisJS'
      }
    })

    assert.equal(project.name, 'Metron')
    assert.equal(project.userId, user.id)
    assert.equal((project.tech_stack as any).backend, 'AdonisJS')
  })
})
