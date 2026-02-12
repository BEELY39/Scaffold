import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  testimonials = [
    {
      name: 'Sophie Dubois',
      role: 'Product Manager',
      company: 'TechFlow',
      avatar: 'https://ui-avatars.com/api/?name=Sophie+Dubois&background=bfdbfe&color=1e40af',
      content: "Scaffold a complètement transformé notre façon de gérer les sprints. L'IA rédige des tickets plus clairs que nous ne l'avons jamais fait."
    },
    {
      name: 'Thomas Martin',
      role: 'CTO',
      company: 'StartUpX',
      avatar: 'https://ui-avatars.com/api/?name=Thomas+Martin&background=fde68a&color=92400e',
      content: "La fonction d'estimation est incroyablement précise. Nous avons réduit nos réunions de planification de 50%."
    },
    {
      name: 'Léa Bernard',
      role: 'Lead Dev',
      company: 'Innovate',
      avatar: 'https://ui-avatars.com/api/?name=Lea+Bernard&background=fbcfe8&color=9d174d',
      content: "Enfin un outil qui comprend le contexte technique. Je tape une phrase, et j'obtiens une spécification complète. Magique."
    }
  ];

  faqs = [
    {
      question: "Comment l'IA génère-t-elle les tickets ?",
      answer: "Notre IA analyse votre courte description et utilise des modèles de langage avancés pour structurer les besoins en User Stories standardisées.",
      open: false
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et ne partageons jamais vos données de projet avec des tiers.",
      open: false
    },
    {
      question: "Puis-je exporter vers Jira ?",
      answer: "Oui, nous proposons des intégrations natives pour exporter vos tickets validés vers Jira, Linear ou GitHub Issues.",
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
