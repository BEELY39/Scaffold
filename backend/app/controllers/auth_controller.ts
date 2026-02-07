import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

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
}
