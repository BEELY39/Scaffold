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
const AuthController = () => import('#controllers/auth_controller')
const PaymentsController = () => import('#controllers/payments_controller')
import { middleware } from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth routes (Google OAuth)
router.get('/auth/google', [AuthController, 'redirect'])
router.get('/auth/google/callback', [AuthController, 'callback'])

// Auth routes (Email/Password)
router.post('/auth/register', [AuthController, 'register'])
router.post('/auth/login', [AuthController, 'login'])

// Stripe webhook (public, requires raw body)
router.post('/api/payments/webhook', [PaymentsController, 'webhook'])

router.group(() => {
  // Auth
  router.get('/auth/me', [AuthController, 'me'])
  router.post('/auth/logout', [AuthController, 'logout'])

  // Users
  router.get('/users', [UsersController, 'index'])
  router.get('/users/:id', [UsersController, 'show'])
  router.post('/users', [UsersController, 'store'])
  router.put('/users/:id', [UsersController, 'update'])
  router.delete('/users/:id', [UsersController, 'destroy'])

  // Usage (plan limits)
  router.get('/usage', [ProjectController, 'getUsage'])

  // Payments (Stripe)
  router.post('/payments/create-checkout', [PaymentsController, 'createCheckout'])
  router.post('/payments/cancel', [PaymentsController, 'cancelSubscription'])
  router.get('/payments/portal', [PaymentsController, 'customerPortal'])

  // Projects
  router.get('/projects', [ProjectController, 'index'])
  router.get('/projects/:id', [ProjectController, 'show'])
  router.post('/projects', [ProjectController, 'store'])
  router.post('/projects/with-tickets', [ProjectController, 'storeWithTickets'])
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
  router.post('/tickets/:id/enrich', [TicketsController, 'enrich'])
}).prefix('/api').use(middleware.auth())
