import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './learn.component.html'
})
export class LearnComponent {
  concepts = [
    {
      title: "C'est quoi la méthode Agile ?",
      slug: 'methode-agile',
      icon: '🎯',
      content: `La méthode Agile est une approche de gestion de projet qui a révolutionné le développement logiciel. Contrairement aux méthodes traditionnelles (comme le cycle en V), l'Agile favorise la flexibilité, la collaboration et les livraisons fréquentes.

Les principes clés de l'Agile :
• Livrer de la valeur rapidement et régulièrement
• Accepter les changements, même tard dans le projet
• Collaborer étroitement avec le client
• Construire des équipes motivées et autonomes
• Mesurer le progrès par le logiciel fonctionnel

En entreprise, presque toutes les équipes de développement utilisent l'Agile. C'est pourquoi en tant qu'étudiant ou développeur junior, maîtriser l'Agile est essentiel pour ton premier emploi ou stage.`
    },
    {
      title: "Comment s'entraîner en Agile ?",
      slug: 'entrainer-agile',
      icon: '💪',
      content: `S'entraîner en Agile, c'est pratiquer sur de vrais projets. Voici comment faire :

1. Crée des projets personnels
Utilise Scaffold pour créer des projets fictifs (une app de todo, un e-commerce, un réseau social). L'IA génère automatiquement des tickets professionnels.

2. Rédige des User Stories
Apprends le format : "En tant que [utilisateur], je veux [action] afin de [bénéfice]". Exemple : "En tant qu'utilisateur, je veux me connecter avec Google afin de ne pas créer de compte."

3. Utilise un Kanban Board
Organise tes tickets en colonnes : To Do, In Progress, Code Review, Done. C'est exactement ce que tu feras en entreprise.

4. Définis des critères d'acceptation
Pour chaque ticket, liste les conditions pour qu'il soit considéré comme terminé. C'est crucial pour éviter les malentendus.

5. Fais des sprints
Un sprint dure généralement 2 semaines. Définis un objectif et travaille pour l'atteindre.`
    },
    {
      title: "C'est quoi Scrum ?",
      slug: 'scrum',
      icon: '🔄',
      content: `Scrum est le framework Agile le plus utilisé en entreprise. Il structure le travail en sprints (cycles de 1-4 semaines) avec des rôles et cérémonies définis.

Les 3 rôles Scrum :
• Product Owner : définit les priorités et le backlog
• Scrum Master : facilite le processus et résout les blocages
• Équipe de développement : réalise le travail

Les cérémonies Scrum :
• Sprint Planning : planification du sprint (quoi faire)
• Daily Standup : point quotidien de 15 min (qu'est-ce que j'ai fait, qu'est-ce que je vais faire, ai-je des blocages)
• Sprint Review : démo au client
• Sprint Retrospective : amélioration continue

Les artefacts Scrum :
• Product Backlog : liste de toutes les fonctionnalités
• Sprint Backlog : tâches du sprint en cours
• Incrément : le produit livrable

En stage ou alternance, tu participeras probablement aux Daily Standups et Sprint Reviews. Avec Scaffold, tu peux t'entraîner à tout ça avant même d'arriver en entreprise.`
    },
    {
      title: "Comment rédiger une User Story ?",
      slug: 'user-story',
      icon: '📝',
      content: `Une User Story est la brique de base de l'Agile. C'est une description simple d'une fonctionnalité du point de vue de l'utilisateur.

Le format standard :
"En tant que [type d'utilisateur], je veux [objectif] afin de [bénéfice]"

Exemples de bonnes User Stories :
• "En tant qu'utilisateur, je veux filtrer les produits par prix afin de trouver rapidement ce qui correspond à mon budget."
• "En tant qu'admin, je veux voir les statistiques de vente afin de prendre des décisions éclairées."
• "En tant que visiteur, je veux m'inscrire avec mon email afin de créer un compte."

Les critères INVEST :
• Independent : indépendante des autres stories
• Negotiable : pas un contrat, peut évoluer
• Valuable : apporte de la valeur
• Estimable : on peut estimer l'effort
• Small : assez petite pour un sprint
• Testable : on peut vérifier si c'est fait

Avec Scaffold, l'IA t'aide à transformer tes idées en User Stories professionnelles.`
    },
    {
      title: "Comment rédiger un ticket Jira ?",
      slug: 'ticket-jira',
      icon: '🎫',
      content: `Jira est l'outil de gestion de projet le plus utilisé en entreprise. Savoir rédiger un bon ticket est une compétence essentielle.

Structure d'un bon ticket :
1. Titre clair et concis
   Mauvais : "Bug login"
   Bon : "Erreur 500 lors de la connexion avec email invalide"

2. User Story
   Explique le besoin du point de vue utilisateur.

3. Description détaillée
   Contexte, comportement actuel, comportement attendu.

4. Critères d'acceptation
   Liste les conditions pour que le ticket soit terminé :
   ✓ L'utilisateur voit un message d'erreur clair
   ✓ Le formulaire ne se soumet pas
   ✓ L'erreur est loggée côté serveur

5. Specs techniques (si nécessaire)
   Endpoint API, base de données, librairies...

6. Estimation
   En points de complexité (1, 2, 3, 5, 8, 13) ou en heures.

7. Labels et priorité
   Bug, Feature, Chore, High, Medium, Low...

Scaffold génère tout ça automatiquement avec l'IA. Tu peux ensuite exporter vers Jira, Trello ou GitHub.`
    },
    {
      title: "C'est quoi un Kanban Board ?",
      slug: 'kanban',
      icon: '📊',
      content: `Le Kanban Board est un tableau visuel qui représente le flux de travail. Chaque colonne représente une étape du processus.

Les colonnes classiques :
• To Do : tâches à faire
• In Progress : en cours de développement
• Code Review : en attente de relecture
• Done : terminé et validé

Règles du Kanban :
1. Limiter le travail en cours (WIP)
   Ne pas avoir trop de tâches "In Progress" à la fois. Ça évite le multitâche inefficace.

2. Visualiser le flux
   En un coup d'œil, on voit l'état du projet.

3. Gérer le flux
   Si une colonne se remplit trop, c'est un goulot d'étranglement à résoudre.

4. Amélioration continue
   Optimiser le processus régulièrement.

Avantages du Kanban :
• Simple à comprendre
• Flexible (pas de sprints fixes)
• Visuel et collaboratif
• Adapté aux équipes de maintenance

Sur Scaffold, tu as un Kanban Board interactif avec drag & drop pour organiser tes tickets comme en entreprise.`
    }
  ];

  resources = [
    { title: 'Le Guide Scrum officiel', url: 'https://scrumguides.org/scrum-guide.html', type: 'Guide' },
    { title: 'Manifeste Agile', url: 'https://agilemanifesto.org/iso/fr/manifesto.html', type: 'Fondamentaux' },
    { title: 'Atlassian - Tutoriels Agile', url: 'https://www.atlassian.com/fr/agile', type: 'Tutoriels' },
  ];
}
