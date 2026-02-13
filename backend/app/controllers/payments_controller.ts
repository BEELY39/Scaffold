import type { HttpContext } from '@adonisjs/core/http'
import { StripeService } from '#services/stripe_service'
import type Stripe from 'stripe'

export default class PaymentsController {
  private stripeService = new StripeService()

  /**
   * POST /api/payments/create-checkout
   * Crée une session Stripe Checkout pour l'upgrade vers Pro
   */
  async createCheckout({ auth, response }: HttpContext) {
    const user = auth.user!

    // Vérifier si déjà Pro
    if (user.planType === 'pro' && user.subscriptionStatus === 'active') {
      return response.status(400).json({
        message: 'Vous êtes déjà abonné au plan Pro',
      })
    }

    try {
      const url = await this.stripeService.createCheckoutSession(user)
      return response.json({ url })
    } catch (error) {
      console.error('PaymentsController: Error creating checkout session', error)
      return response.status(500).json({
        message: 'Erreur lors de la création de la session de paiement',
      })
    }
  }

  /**
   * POST /api/payments/webhook
   * Webhook Stripe pour recevoir les événements (public, vérifie la signature)
   */
  async webhook({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')
    if (!signature) {
      return response.status(400).json({ error: 'Missing stripe-signature header' })
    }

    try {
      // Récupérer le raw body pour la vérification de signature
      const rawBody = request.raw()
      if (!rawBody) {
        return response.status(400).json({ error: 'Missing request body' })
      }

      const event = this.stripeService.verifyWebhookSignature(rawBody, signature)

      // Traiter les différents types d'événements
      switch (event.type) {
        case 'checkout.session.completed':
          await this.stripeService.handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session
          )
          break

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await this.stripeService.handleSubscriptionChange(
            event.data.object as Stripe.Subscription
          )
          break

        case 'invoice.payment_failed':
          // On pourrait notifier l'utilisateur ici
          console.log('PaymentsController: Payment failed for invoice', event.data.object)
          break

        default:
          console.log(`PaymentsController: Unhandled event type ${event.type}`)
      }

      return response.json({ received: true })
    } catch (error) {
      console.error('PaymentsController: Webhook error', error)
      return response.status(400).json({ error: 'Webhook verification failed' })
    }
  }

  /**
   * POST /api/payments/cancel
   * Annule l'abonnement de l'utilisateur
   */
  async cancelSubscription({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!user.stripeSubscriptionId) {
      return response.status(400).json({
        message: "Pas d'abonnement actif",
      })
    }

    try {
      await this.stripeService.cancelSubscription(user)
      return response.json({
        message: 'Abonnement annulé. Vous conservez l\'accès Pro jusqu\'à la fin de la période.',
      })
    } catch (error) {
      console.error('PaymentsController: Error canceling subscription', error)
      return response.status(500).json({
        message: "Erreur lors de l'annulation de l'abonnement",
      })
    }
  }

  /**
   * GET /api/payments/portal
   * Redirige vers le portail client Stripe pour gérer l'abonnement
   */
  async customerPortal({ auth, response }: HttpContext) {
    const user = auth.user!

    if (!user.stripeCustomerId) {
      return response.status(400).json({
        message: 'Pas de compte de paiement associé',
      })
    }

    try {
      const url = await this.stripeService.createPortalSession(user)
      return response.json({ url })
    } catch (error) {
      console.error('PaymentsController: Error creating portal session', error)
      return response.status(500).json({
        message: 'Erreur lors de la création de la session de gestion',
      })
    }
  }
}
