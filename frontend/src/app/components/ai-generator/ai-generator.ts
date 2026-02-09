import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AiGeneratorInput {
  projectName: string;
  projectDescription: string;
  techStack: string;
  additionalContext: string;
}

@Component({
  selector: 'app-ai-generator',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800">AI Ticket Generator</h3>
          <p class="text-sm text-gray-500">Describe your project and let AI generate professional tickets</p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Project Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input
            type="text"
            [(ngModel)]="formData.projectName"
            placeholder="e.g., E-commerce Platform"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <!-- Project Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
          <textarea
            [(ngModel)]="formData.projectDescription"
            rows="3"
            placeholder="Describe the main purpose and features of your project..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Tech Stack -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
          <input
            type="text"
            [(ngModel)]="formData.techStack"
            placeholder="e.g., Angular, Node.js, PostgreSQL"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <!-- Additional Context -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Additional Context (Optional)</label>
          <textarea
            [(ngModel)]="formData.additionalContext"
            rows="2"
            placeholder="Any specific requirements, constraints, or preferences..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Generate Button -->
        <button
          (click)="generate()"
          [disabled]="isGenerating() || !isValid()"
          class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          @if (isGenerating()) {
            <span class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Generating Tickets...</span>
          } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Generate with AI</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiGenerator {
  isGenerating = input<boolean>(false);
  onGenerate = output<AiGeneratorInput>();

  formData: AiGeneratorInput = {
    projectName: '',
    projectDescription: '',
    techStack: '',
    additionalContext: ''
  };

  isValid(): boolean {
    return !!(this.formData.projectName.trim() && this.formData.projectDescription.trim());
  }

  generate(): void {
    if (this.isValid()) {
      this.onGenerate.emit({ ...this.formData });
    }
  }
}
