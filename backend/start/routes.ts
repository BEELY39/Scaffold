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
  router.post('/projects', [ProjectController, 'store'])
  router.post('/users', [UsersController, 'store'])
  router.post('/tickets', [TicketsController, 'store'])
}).prefix('/api')
