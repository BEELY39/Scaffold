import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { EmailVerificationService } from '#services/email_verification_service'

export default class AuthController {
  /**
   * Redirige vers Google pour l'authentification
   */
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  /**
   * Callback après authentification Google
   */
  async callback({ ally, response }: HttpContext) {
    const google = ally.use('google')

    /**
     * Si l'utilisateur a annulé l'authentification
     */
    if (google.accessDenied()) {
      return response.status(401).json({ message: 'Access denied' })
    }

    /**
     * Si OAuth a échoué
     */
    if (google.hasError()) {
      return response.status(400).json({ message: google.getError() })
    }

    /**
     * Récupère les infos de l'utilisateur Google
     */
    const googleUser = await google.user()

    /**
     * Trouve ou crée l'utilisateur
     */
    const user = await User.firstOrCreate(
      { googleId: googleUser.id },
      {
        googleId: googleUser.id,
        email: googleUser.email!,
        fullName: googleUser.name,
        avatar: googleUser.avatarUrl,
        password: null,
      }
    )

    /**
     * Met à jour l'avatar si changé
     */
    if (user.avatar !== googleUser.avatarUrl) {
      user.avatar = googleUser.avatarUrl
      await user.save()
    }

    /**
     * Génère un access token pour l'utilisateur
     */
    const token = await User.accessTokens.create(user)

    // Redirige vers le frontend avec le token
    // Tu peux changer cette URL selon ton frontend
    const frontendUrl = `http://localhost:4200/auth/callback?token=${token.value!.release()}`
    return response.redirect(frontendUrl)
  }

  /**
   * Retourne l'utilisateur connecté
   */
  async me({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    return response.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    })
  }

  /**
   * Déconnexion - supprime le token actuel
   */
  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.json({ message: 'Logged out successfully' })
  }

  /**
   * Inscription par email/password
   */
  async register({ request, response }: HttpContext) {
    const { fullName, email, password, passwordConfirmation } = request.only([
      'fullName',
      'email',
      'password',
      'passwordConfirmation',
    ])

    // Validation
    if (!fullName || !email || !password) {
      return response.status(422).json({
        message: 'Tous les champs sont requis',
      })
    }

    if (password !== passwordConfirmation) {
      return response.status(422).json({
        message: 'Les mots de passe ne correspondent pas',
      })
    }

    if (password.length < 8) {
      return response.status(422).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      })
    }

    // Vérifier si l'email existe réellement (Maileroo/Zeruh API)
    const emailVerificationService = new EmailVerificationService()
    const emailError = await emailVerificationService.validateForRegistration(email)
    if (emailError) {
      return response.status(422).json({
        message: emailError,
      })
    }

    // Vérifier si email existe déjà
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.status(422).json({
        message: 'Cet email est déjà utilisé',
      })
    }

    // Créer l'utilisateur
    const user = await User.create({
      fullName,
      email,
      password: await hash.make(password),
      planType: 'free',
      aiGenerationsThisMonth: 0,
      aiGenerationsLimit: 2,
    })

    // Générer token
    const token = await User.accessTokens.create(user)

    return response.status(201).json({
      token: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  /**
   * Connexion par email/password
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // Trouver l'utilisateur
    const user = await User.findBy('email', email)
    if (!user || !user.password) {
      return response.status(401).json({
        message: 'Email ou mot de passe incorrect',
      })
    }

    // Vérifier le mot de passe
    const isValid = await hash.verify(user.password, password)
    if (!isValid) {
      return response.status(401).json({
        message: 'Email ou mot de passe incorrect',
      })
    }

    // Générer token
    const token = await User.accessTokens.create(user)

    return response.status(200).json({
      token: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }
}
