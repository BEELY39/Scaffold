import { Component, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Demo } from '../../components/demo/demo';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, Demo],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  authService = inject(AuthService);
  demoModal = viewChild<Demo>('demoModal');

  openDemo() {
    this.demoModal()?.openModal();
  }

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
