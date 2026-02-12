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
  templateUrl: './ai-generator.html',
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
