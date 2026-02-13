import env from '#start/env'

interface VerificationResult {
  isValid: boolean
  isDeliverable: boolean
  isDisposable: boolean
  isFree: boolean
  reason: string
  score: number
  status: 'deliverable' | 'risky' | 'undeliverable' | 'unknown'
}

interface ZeruhResponse {
  success: boolean
  message: string
  result: {
    email_address: string
    validation_details: {
      format_valid: boolean
      mx_found: boolean
      smtp_check: boolean
      catch_all: boolean
      role: boolean
      disposable: boolean
      free: boolean
    }
    score: number
    status: string
    reason: string
  }
}

export class EmailVerificationService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.zeruh.com/v1/verify'
  private readonly enabled: boolean

  constructor() {
    this.apiKey = env.get('MAILEROO_API_KEY', '')
    this.enabled = !!this.apiKey
  }

  /**
   * Vérifie si une adresse email existe réellement
   */
  async verify(email: string): Promise<VerificationResult> {
    // Si pas de clé API, on skip la vérification externe
    if (!this.enabled) {
      console.warn('EmailVerificationService: MAILEROO_API_KEY non configurée, vérification basique uniquement')
      return this.basicValidation(email)
    }

    try {
      const url = new URL(this.baseUrl)
      url.searchParams.set('api_key', this.apiKey)
      url.searchParams.set('email_address', email)
      url.searchParams.set('timeout', '15')

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('EmailVerificationService: API error', response.status)
        return this.basicValidation(email)
      }

      const data = (await response.json()) as ZeruhResponse

      if (!data.success) {
        console.error('EmailVerificationService: Verification failed', data.message)
        return this.basicValidation(email)
      }

      const result = data.result
      const validation = result.validation_details

      return {
        isValid: validation.format_valid && validation.mx_found,
        isDeliverable: result.status === 'deliverable',
        isDisposable: validation.disposable,
        isFree: validation.free,
        reason: result.reason,
        score: result.score,
        status: result.status as VerificationResult['status'],
      }
    } catch (error) {
      console.error('EmailVerificationService: Error verifying email', error)
      return this.basicValidation(email)
    }
  }

  /**
   * Validation basique sans API externe (fallback)
   */
  private basicValidation(email: string): VerificationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)

    // Liste de domaines jetables courants
    const disposableDomains = [
      'tempmail.com', 'throwaway.email', 'guerrillamail.com',
      'mailinator.com', '10minutemail.com', 'temp-mail.org',
      'fakeinbox.com', 'trashmail.com', 'yopmail.com',
    ]

    const domain = email.split('@')[1]?.toLowerCase()
    const isDisposable = disposableDomains.some(d => domain?.includes(d))

    return {
      isValid,
      isDeliverable: isValid, // On assume deliverable si format valide (sans API)
      isDisposable,
      isFree: ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain || ''),
      reason: isValid ? 'basic_validation_only' : 'invalid_format',
      score: isValid ? 50 : 0,
      status: isValid ? 'unknown' : 'undeliverable',
    }
  }

  /**
   * Vérifie si l'email est acceptable pour l'inscription
   * Retourne un message d'erreur si refusé, null si OK
   */
  async validateForRegistration(email: string): Promise<string | null> {
    const result = await this.verify(email)

    // Format invalide
    if (!result.isValid) {
      return "Format d'email invalide"
    }

    // Email jetable (disposable)
    if (result.isDisposable) {
      return 'Les adresses email temporaires ne sont pas acceptées'
    }

    // Email non délivrable (seulement si on a une vraie vérification API)
    if (this.enabled && result.status === 'undeliverable') {
      return "Cette adresse email n'existe pas ou ne peut pas recevoir de messages"
    }

    // Score trop bas (seulement si on a une vraie vérification API)
    if (this.enabled && result.score < 30 && result.status !== 'deliverable') {
      return 'Cette adresse email semble invalide ou risquée'
    }

    return null // Email accepté
  }
}
