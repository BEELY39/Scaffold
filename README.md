# Scaffold

Générateur de tickets agile propulsé par IA. Décrivez votre projet et sa stack technique, et Scaffold génère automatiquement des tickets de développement professionnels.

## Stack Technique

### Backend
- **AdonisJS 6** - Framework Node.js
- **PostgreSQL** - Base de données
- **Google Gemini** - IA pour la génération de tickets
- **@adonisjs/ally** - OAuth (Google)
- **@adonisjs/auth** - Authentification par access tokens

### Frontend
- **Angular 21** - Framework frontend
- **Tailwind CSS 4** - Styling
- **SSR** - Server-Side Rendering pour le SEO

## Installation

### Prérequis
- Node.js 20+
- PostgreSQL
- Compte Google Cloud (pour OAuth)
- Clé API Gemini

### Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your_app_key
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=scaffold_db

GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3333/auth/google/callback
```

Lancer les migrations :

```bash
node ace migration:run
```

Démarrer le serveur :

```bash
node ace serve --watch
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## API Endpoints

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/auth/google` | Redirection OAuth Google |
| GET | `/auth/google/callback` | Callback OAuth |
| GET | `/api/auth/me` | Utilisateur connecté |
| POST | `/api/auth/logout` | Déconnexion |

### Utilisateurs
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users` | Liste des utilisateurs |
| GET | `/api/users/:id` | Détail d'un utilisateur |
| POST | `/api/users` | Créer un utilisateur |
| PUT | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

### Projets
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/projects` | Liste des projets |
| GET | `/api/projects/:id` | Détail d'un projet |
| POST | `/api/projects` | Créer un projet |
| PUT | `/api/projects/:id` | Modifier un projet |
| DELETE | `/api/projects/:id` | Supprimer un projet |
| POST | `/api/projects/:id/generate-tickets` | Générer les tickets IA |

### Tickets
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/tickets` | Liste des tickets |
| GET | `/api/tickets/:id` | Détail d'un ticket |
| POST | `/api/tickets` | Créer un ticket |
| PUT | `/api/tickets/:id` | Modifier un ticket |
| DELETE | `/api/tickets/:id` | Supprimer un ticket |
| GET | `/api/projects/:projectId/tickets` | Tickets d'un projet |

## Structure des Tickets Générés

Chaque ticket généré par l'IA contient :

- **title** - Titre avec préfixe [Feature], [Chore], [Bug], [Spike]
- **description** - Description courte
- **userStory** - Format "En tant que... je veux... afin de..."
- **technicalSpecs** - Spécifications techniques (array)
- **acceptanceCriteria** - Critères d'acceptation (array)
- **type** - feature, chore, bug, spike
- **priority** - low, medium, high, critical
- **complexity** - 1 à 5
- **estimatedHours** - Estimation en heures
- **notes** - Notes additionnelles

## Licence

MIT
# Scaffold
# Scaffold
