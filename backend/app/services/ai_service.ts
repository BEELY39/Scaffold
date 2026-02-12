import env from '#start/env'

interface GeneratedTicket {
  title: string
  description: string
  userStory: string
  technicalSpecs: string[]
  acceptanceCriteria: string[]
  type: 'feature' | 'bug' | 'chore' | 'spike'
  priority: 'low' | 'medium' | 'high' | 'critical'
  complexity: number
  position: number
  estimatedHours: number
  notes: string | null
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

    const prompt = `Tu es un chef de projet agile senior dans une agence de développement. Tu dois générer des tickets professionnels et détaillés pour le projet suivant.

PROJET: ${projectName}
DESCRIPTION: ${projectDescription}
STACK TECHNIQUE: ${techStackString}

Génère entre 6 et 12 tickets de développement professionnels, ordonnés logiquement (setup/config en premier, puis les fonctionnalités core, puis les améliorations).

Chaque ticket DOIT contenir TOUS ces champs:

1. "title": Titre court et précis avec préfixe [Feature], [Chore], [Spike] ou [Bug]
   Exemple: "[Chore] Configuration initiale du projet Next.js"

2. "description": Description courte (1-2 phrases) du contexte et de l'objectif

3. "userStory": User Story au format "En tant que [rôle], je veux [action], afin de [bénéfice]"
   Exemple: "En tant que développeur, je veux configurer l'environnement de développement, afin de pouvoir commencer à coder rapidement."

4. "technicalSpecs": Tableau de spécifications techniques détaillées (3-6 items)
   Exemple: ["Utiliser create-next-app avec TypeScript", "Configurer ESLint et Prettier", "Ajouter les variables d'environnement dans .env.local"]

5. "acceptanceCriteria": Tableau de critères d'acceptation vérifiables (3-5 items)
   Exemple: ["Le projet démarre sans erreur avec npm run dev", "ESLint ne retourne aucune erreur", "Les tests passent avec npm test"]

6. "type": "feature" | "chore" | "spike" (chore=setup/config, feature=fonctionnalité, spike=recherche/POC)

7. "priority": "low" | "medium" | "high" | "critical"

8. "complexity": Nombre de 1 à 5 (1=très simple ~1h, 2=simple ~2-4h, 3=moyen ~4-8h, 4=complexe ~1-2j, 5=très complexe ~3-5j)

9. "position": Ordre du ticket (commence à 1)

10. "estimatedHours": Estimation en heures (basée sur la complexité)

11. "notes": Notes additionnelles ou points d'attention (peut être null si rien de spécial)

IMPORTANT:
- Les spécifications techniques doivent être précises et utiliser la stack technique mentionnée
- Les critères d'acceptation doivent être vérifiables (testables)
- Adapte le contenu à la stack technique fournie
- Écris tout en français

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après.`

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
          maxOutputTokens: 8192,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${error}`)
    }

    const data = await response.json()
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
}
