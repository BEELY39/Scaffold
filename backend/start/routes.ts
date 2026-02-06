/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ProjectController = () => import('#controllers/projects_controller')
const UsersController = () => import('#controllers/users_controller')
const TicketsController = () => import('#controllers/tickets_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  // Users
  router.get('/users', [UsersController, 'index'])
  router.get('/users/:id', [UsersController, 'show'])
  router.post('/users', [UsersController, 'store'])
  router.put('/users/:id', [UsersController, 'update'])
  router.delete('/users/:id', [UsersController, 'destroy'])

  // Projects
  router.get('/projects', [ProjectController, 'index'])
  router.get('/projects/:id', [ProjectController, 'show'])
  router.post('/projects', [ProjectController, 'store'])
  router.put('/projects/:id', [ProjectController, 'update'])
  router.delete('/projects/:id', [ProjectController, 'destroy'])
  router.post('/projects/:id/generate-tickets', [ProjectController, 'generateTickets'])

  // Tickets
  router.get('/tickets', [TicketsController, 'index'])
  router.get('/tickets/:id', [TicketsController, 'show'])
  router.post('/tickets', [TicketsController, 'store'])
  router.put('/tickets/:id', [TicketsController, 'update'])
  router.delete('/tickets/:id', [TicketsController, 'destroy'])
  router.get('/projects/:projectId/tickets', [TicketsController, 'byProject'])
}).prefix('/api')
