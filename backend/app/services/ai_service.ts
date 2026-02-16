import env from '#start/env'

// Interface pour la génération initiale (légère, sans détails techniques)
interface GeneratedTicket {
  title: string
  description: string
  userStory: string
  type: 'feature' | 'bug' | 'chore' | 'spike'
  priority: 'low' | 'medium' | 'high' | 'critical'
  complexity: number
  position: number
  estimatedHours: number
  notes: string | null
  // technicalSpecs et acceptanceCriteria sont générés à la demande (lazy loading)
}

// Interface pour l'enrichissement à la demande
interface TicketDetails {
  technicalSpecs: string[]
  acceptanceCriteria: string[]
}

interface EnrichTicketParams {
  title: string
  description: string
  userStory: string
  techStack: string
}

interface GenerateTicketsParams {
  projectName: string
  projectDescription: string
  techStack: string[] | Record<string, string>
}

export default class AiService {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = env.get('GEMINI_API_KEY', '')
    this.apiUrl = env.get('GEMINI_API_URL', '')
  }

  async generateTickets(params: GenerateTicketsParams): Promise<GeneratedTicket[]> {
    const { projectName, projectDescription, techStack } = params

    // Supporte les deux formats: tableau ou objet
    const techStackString = Array.isArray(techStack)
      ? techStack.join(', ')
      : Object.entries(techStack)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')

    const prompt = `Tu es un chef de projet agile senior. Génère des tickets professionnels pour ce projet.

PROJET: ${projectName}
DESCRIPTION: ${projectDescription}
STACK TECHNIQUE: ${techStackString}

Génère entre 6 et 12 tickets ordonnés logiquement (setup → fonctionnalités core → améliorations).

Chaque ticket DOIT contenir UNIQUEMENT ces champs:

1. "title": Titre court avec préfixe [Feature], [Chore], [Spike] ou [Bug]
2. "description": Description courte (1-2 phrases)
3. "userStory": "En tant que [rôle], je veux [action], afin de [bénéfice]"
4. "type": "feature" | "chore" | "spike" | "bug"
5. "priority": "low" | "medium" | "high" | "critical"
6. "complexity": 1 à 5 (1=~1h, 2=~2-4h, 3=~4-8h, 4=~1-2j, 5=~3-5j)
7. "position": Ordre du ticket (commence à 1)
8. "estimatedHours": Estimation en heures
9. "notes": Notes additionnelles (peut être null)

IMPORTANT: Ne génère PAS de technicalSpecs ni acceptanceCriteria (ils seront générés séparément).
Écris tout en français.

Réponds UNIQUEMENT avec un tableau JSON valide.`

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${error}`)
    }

    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>
    }
    const content = data.candidates[0].content.parts[0].text

    // Nettoyer la réponse (enlever les backticks markdown si présents)
    let jsonString = content.trim()
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7)
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3)
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3)
    }
    jsonString = jsonString.trim()

    try {
      const tickets = JSON.parse(jsonString) as GeneratedTicket[]
      return tickets
    } catch {
      throw new Error('Failed to parse AI response as JSON')
    }
  }

  /**
   * Enrichit un ticket avec les détails techniques (lazy loading)
   * Appelé quand l'utilisateur ouvre un ticket pour la première fois
   */
  async enrichTicketDetails(params: EnrichTicketParams): Promise<TicketDetails> {
    const { title, description, userStory, techStack } = params

    const prompt = `Tu es un chef de projet agile senior. Pour ce ticket, génère les détails techniques.

TICKET: ${title}
DESCRIPTION: ${description}
USER STORY: ${userStory}
STACK TECHNIQUE: ${techStack}

Génère un objet JSON avec:

1. "technicalSpecs": Tableau de 3-6 spécifications techniques détaillées et précises
   Exemple: ["Créer le composant UserProfile avec Angular", "Utiliser un FormGroup réactif pour le formulaire", "Appeler l'API PUT /api/users/:id"]

2. "acceptanceCriteria": Tableau de 3-5 critères d'acceptation vérifiables (testables)
   Exemple: ["Le formulaire affiche les données actuelles de l'utilisateur", "La validation empêche la soumission si les champs sont invalides", "Un toast de succès s'affiche après la sauvegarde"]

IMPORTANT:
- Adapte les spécifications à la stack technique fournie
- Les critères doivent être vérifiables par un testeur
- Écris tout en français

Réponds UNIQUEMENT avec un objet JSON valide (pas un tableau).`

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${error}`)
    }

    const data = (await response.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>
    }
    const content = data.candidates[0].content.parts[0].text

    // Nettoyer la réponse
    let jsonString = content.trim()
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7)
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.slice(3)
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.slice(0, -3)
    }
    jsonString = jsonString.trim()

    try {
      const details = JSON.parse(jsonString) as TicketDetails
      return details
    } catch {
      throw new Error('Failed to parse AI enrichment response as JSON')
    }
  }
}
