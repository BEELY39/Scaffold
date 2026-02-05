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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/projects', [ProjectController, 'store'])
