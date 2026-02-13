import Stripe from 'stripe'
import env from '#start/env'
import User from '#models/user'

export class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(env.get('STRIPE_SECRET_KEY'))
  }

  /**
   * Évite les doublons: réutilise le customer Stripe existant
   */
  async getOrCreateCustomer(user: User): Promise<string> {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.fullName,
      metadata: { userId: String(user.id) },
    })

    user.stripeCustomerId = customer.id
    await user.save()

    return customer.id
  }

  /**
   * Crée une session Stripe Checkout pour l'abonnement Pro
   */
  async createCheckoutSession(user: User): Promise<string> {
    const customerId = await this.getOrCreateCustomer(user)
    const priceId = env.get('STRIPE_PRICE_ID_PRO')
    const frontendUrl = env.get('FRONTEND_URL')

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: String(user.id),
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${frontendUrl}/dashboard?upgrade=success`,
      cancel_url: `${frontendUrl}/dashboard?upgrade=canceled`,
      metadata: { userId: String(user.id) },
    })

    return session.url!
  }

  /**
   * Webhook: checkout.session.completed
   * Active l'abonnement Pro après paiement réussi
   */
  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.client_reference_id
    if (!userId) {
      console.error('StripeService: Missing client_reference_id in checkout session')
      return
    }

    const user = await User.find(Number(userId))
    if (!user) {
      console.error('StripeService: User not found for checkout session', userId)
      return
    }

    // Récupérer l'ID de l'abonnement
    const subscriptionId = session.subscription as string

    // Activer le plan Pro avec générations illimitées
    user.stripeSubscriptionId = subscriptionId
    user.subscriptionStatus = 'active'
    user.planType = 'pro'
    user.aiGenerationsLimit = -1 // -1 = illimité
    await user.save()

    console.log(`StripeService: User ${user.id} upgraded to Pro`)
  }

  /**
   * Webhook: customer.subscription.updated / customer.subscription.deleted
   * Synchronise le statut de l'abonnement
   */
  async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    const user = await User.findBy('stripeSubscriptionId', subscription.id)
    if (!user) {
      // Peut arriver pour un nouvel abonnement, on cherche par customer
      const customerId = subscription.customer as string
      const userByCustomer = await User.findBy('stripeCustomerId', customerId)
      if (userByCustomer && !userByCustomer.stripeSubscriptionId) {
        userByCustomer.stripeSubscriptionId = subscription.id
        await this.updateUserSubscriptionStatus(userByCustomer, subscription.status)
      }
      return
    }

    await this.updateUserSubscriptionStatus(user, subscription.status)
  }

  /**
   * Met à jour le statut de l'abonnement d'un utilisateur
   */
  private async updateUserSubscriptionStatus(
    user: User,
    status: Stripe.Subscription.Status
  ): Promise<void> {
    if (status === 'active') {
      user.subscriptionStatus = 'active'
      user.planType = 'pro'
      user.aiGenerationsLimit = -1
    } else if (status === 'canceled' || status === 'unpaid') {
      // Rétrograder vers le plan Free
      user.subscriptionStatus = 'canceled'
      user.planType = 'free'
      user.aiGenerationsLimit = 2
      user.stripeSubscriptionId = null
    } else if (status === 'past_due') {
      user.subscriptionStatus = 'past_due'
      // On garde le plan Pro mais on note le problème de paiement
    }

    await user.save()
    console.log(`StripeService: User ${user.id} subscription status updated to ${status}`)
  }

  /**
   * Annule l'abonnement d'un utilisateur
   */
  async cancelSubscription(user: User): Promise<void> {
    if (!user.stripeSubscriptionId) {
      throw new Error('No active subscription')
    }

    await this.stripe.subscriptions.cancel(user.stripeSubscriptionId)
    console.log(`StripeService: Subscription canceled for user ${user.id}`)
  }

  /**
   * Crée une session pour le portail client Stripe
   * Permet à l'utilisateur de gérer son abonnement
   */
  async createPortalSession(user: User): Promise<string> {
    if (!user.stripeCustomerId) {
      throw new Error('No Stripe customer')
    }

    const frontendUrl = env.get('FRONTEND_URL')

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${frontendUrl}/dashboard`,
    })

    return session.url
  }

  /**
   * Vérifie la signature du webhook Stripe
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }
}
