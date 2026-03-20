import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { GeminiApiService } from '../../shared/gemini-api.service';

type EditorAction = 'refine' | 'expand' | 'formalize';

@Component({
  selector: 'app-ai-text-editor',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="page">
      <header>
        <h1>AI Text Editor</h1>
        <p>Refine, expand, and formalize text using Gemini over HTTP.</p>
      </header>

      <form class="panel" [formGroup]="editorForm" (ngSubmit)="runAction('refine')">
        <label for="editor-api-key">Gemini API key</label>
        <input
          id="editor-api-key"
          type="password"
          formControlName="apiKey"
          autocomplete="off"
          placeholder="Paste your Gemini API key"
        />

        <label for="source-text">Source text</label>
        <textarea
          id="source-text"
          rows="8"
          formControlName="sourceText"
          placeholder="Paste or write text you want to improve"
        ></textarea>

        <div class="actions" role="group" aria-label="Text transformation actions">
          <button type="button" (click)="runAction('refine')" [disabled]="isLoading() || isRunDisabled()">
            Refine
          </button>
          <button type="button" (click)="runAction('expand')" [disabled]="isLoading() || isRunDisabled()">
            Expand
          </button>
          <button type="button" (click)="runAction('formalize')" [disabled]="isLoading() || isRunDisabled()">
            Formalize
          </button>
        </div>
      </form>

      @if (errorMessage()) {
        <p class="error" role="alert">{{ errorMessage() }}</p>
      }

      <section class="panel" aria-live="polite" aria-busy="{{ isLoading() }}">
        <h2>Generated text</h2>
        @if (isLoading()) {
          <p>Generating text...</p>
        } @else {
          <textarea rows="10" [value]="resultText()" readonly></textarea>
        }
        <button type="button" (click)="replaceSource()" [disabled]="!resultText() || isLoading()">
          Replace source with generated text
        </button>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page {
        display: grid;
        gap: 1rem;
      }

      .panel {
        display: grid;
        gap: 0.65rem;
        background: #ffffff;
        border: 1px solid #c8d4d3;
        border-radius: 0.85rem;
        padding: 1rem;
      }

      h1,
      h2 {
        margin: 0;
      }

      p {
        margin: 0;
      }

      input,
      textarea,
      button {
        font: inherit;
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid #8ca3a0;
        border-radius: 0.55rem;
        padding: 0.6rem 0.7rem;
      }

      textarea[readonly] {
        background: #f2f5f4;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      button {
        border: 0;
        border-radius: 999px;
        background: #0f766e;
        color: #ffffff;
        padding: 0.5rem 0.85rem;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .error {
        color: #a31f1f;
        font-weight: 600;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiTextEditorComponent {
  private readonly gemini = inject(GeminiApiService);

  readonly editorForm = new FormGroup({
    apiKey: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)]
    }),
    sourceText: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)]
    })
  });

  readonly isLoading = signal(false);
  readonly resultText = signal('');
  readonly errorMessage = signal('');
  private readonly formStatus = toSignal(this.editorForm.statusChanges, {
    initialValue: this.editorForm.status
  });
  readonly isRunDisabled = computed(
    () => this.formStatus() === 'INVALID' || this.isLoading()
  );

  constructor() {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      this.editorForm.controls.apiKey.setValue(storedApiKey);
    }
  }

  runAction(action: EditorAction): void {
    this.editorForm.markAllAsTouched();
    if (this.editorForm.invalid) {
      return;
    }

    const apiKey = this.editorForm.controls.apiKey.value.trim();
    const sourceText = this.editorForm.controls.sourceText.value.trim();

    localStorage.setItem('geminiApiKey', apiKey);
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.gemini
      .generateText(apiKey, this.buildPrompt(action, sourceText), {
        systemInstruction:
          'You are an expert editor. Return only the transformed text without commentary.'
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (result) => this.resultText.set(result),
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
        }
      });
  }

  replaceSource(): void {
    const nextText = this.resultText().trim();
    if (!nextText) {
      return;
    }

    this.editorForm.controls.sourceText.setValue(nextText);
  }

  private buildPrompt(action: EditorAction, sourceText: string): string {
    if (action === 'expand') {
      return `Expand the following text with relevant detail and preserve the original meaning:\n\n${sourceText}`;
    }

    if (action === 'formalize') {
      return `Rewrite the following text in a formal and professional tone:\n\n${sourceText}`;
    }

    return `Refine the following text for clarity and flow while keeping its tone:\n\n${sourceText}`;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return `Gemini request failed: ${error.message}`;
    }

    return 'Gemini request failed. Check your API key and network connectivity.';
  }
}
