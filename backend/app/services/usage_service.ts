import User from '#models/user'
import { DateTime } from 'luxon'

export interface UsageInfo {
  allowed: boolean
  remaining: number
  limit: number
  used: number
  resetDate: DateTime
}

export class UsageService {
  /**
   * Vérifie si l'utilisateur peut générer des tickets
   */
  async canGenerate(user: User): Promise<UsageInfo> {
    // Reset mensuel si nécessaire
    await this.checkAndResetMonthlyUsage(user)

    const remaining = user.aiGenerationsLimit - user.aiGenerationsThisMonth
    const resetDate = user.billingPeriodStart.plus({ months: 1 })

    return {
      allowed: remaining > 0,
      remaining,
      limit: user.aiGenerationsLimit,
      used: user.aiGenerationsThisMonth,
      resetDate,
    }
  }

  /**
   * Incrémente le compteur après une génération réussie
   */
  async trackGeneration(user: User): Promise<void> {
    user.aiGenerationsThisMonth += 1
    await user.save()
  }

  /**
   * Reset le compteur si on est dans un nouveau mois
   */
  private async checkAndResetMonthlyUsage(user: User): Promise<void> {
    const now = DateTime.now()

    // Si billingPeriodStart n'est pas défini, l'initialiser
    if (!user.billingPeriodStart) {
      user.billingPeriodStart = now
      user.aiGenerationsThisMonth = 0
      await user.save()
      return
    }

    const periodEnd = user.billingPeriodStart.plus({ months: 1 })

    if (now >= periodEnd) {
      user.aiGenerationsThisMonth = 0
      user.billingPeriodStart = now
      await user.save()
    }
  }
}
