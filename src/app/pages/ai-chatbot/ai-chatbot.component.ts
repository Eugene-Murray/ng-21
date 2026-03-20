import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { GeminiApiService, GeminiChatMessage } from '../../shared/gemini-api.service';

interface ChatBubble {
  readonly role: 'user' | 'model';
  readonly text: string;
  readonly timestamp: string;
}

@Component({
  selector: 'app-ai-chatbot',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="page">
      <header>
        <h1>AI Chatbot</h1>
        <p>A simple Gemini-powered chatbot using Angular and HttpClient.</p>
      </header>

      <form class="panel" [formGroup]="chatForm" (ngSubmit)="sendMessage()">
        <label for="chat-api-key">Gemini API key</label>
        <input
          id="chat-api-key"
          type="password"
          formControlName="apiKey"
          autocomplete="off"
          placeholder="Paste your Gemini API key"
        />

        <label for="chat-input">Message</label>
        <textarea
          id="chat-input"
          rows="3"
          formControlName="message"
          placeholder="Ask something"
        ></textarea>

        <div class="actions">
          <button type="submit" [disabled]="isSendDisabled()">Send</button>
          <button type="button" (click)="clearChat()" [disabled]="isLoading()">Clear</button>
        </div>
      </form>

      @if (errorMessage()) {
        <p class="error" role="alert">{{ errorMessage() }}</p>
      }

      <section class="chat-log" aria-live="polite" aria-busy="{{ isLoading() }}">
        @for (bubble of chatBubbles(); track bubble.timestamp + bubble.role) {
          <article [class.user]="bubble.role === 'user'" [class.model]="bubble.role === 'model'">
            <h2>{{ bubble.role === 'user' ? 'You' : 'Gemini' }}</h2>
            <p>{{ bubble.text }}</p>
          </article>
        } @empty {
          <p class="hint">No messages yet. Start a conversation.</p>
        }
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
        gap: 0.6rem;
        background: #ffffff;
        border: 1px solid #c8d4d3;
        border-radius: 0.85rem;
        padding: 1rem;
      }

      h1,
      h2,
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

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      button {
        border: 0;
        border-radius: 999px;
        padding: 0.5rem 0.9rem;
        background: #0f766e;
        color: #ffffff;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .chat-log {
        display: grid;
        gap: 0.65rem;
      }

      article {
        padding: 0.7rem 0.8rem;
        border-radius: 0.8rem;
      }

      article.user {
        background: #d6ece9;
      }

      article.model {
        background: #f1f3f5;
      }

      .error {
        color: #a31f1f;
        font-weight: 600;
      }

      .hint {
        color: #496a67;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatbotComponent {
  private readonly gemini = inject(GeminiApiService);

  readonly chatForm = new FormGroup({
    apiKey: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)]
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)]
    })
  });

  readonly chatBubbles = signal<readonly ChatBubble[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  private readonly formStatus = toSignal(this.chatForm.statusChanges, {
    initialValue: this.chatForm.status
  });
  readonly isSendDisabled = computed(
    () => this.formStatus() === 'INVALID' || this.isLoading()
  );

  constructor() {
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      this.chatForm.controls.apiKey.setValue(storedApiKey);
    }
  }

  sendMessage(): void {
    this.chatForm.markAllAsTouched();
    if (this.chatForm.controls.apiKey.invalid || this.chatForm.controls.message.invalid) {
      return;
    }

    const apiKey = this.chatForm.controls.apiKey.value.trim();
    const messageText = this.chatForm.controls.message.value.trim();
    if (!messageText) {
      return;
    }

    localStorage.setItem('geminiApiKey', apiKey);

    const userMessage: ChatBubble = {
      role: 'user',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    this.chatBubbles.update((messages) => [...messages, userMessage]);
    this.chatForm.controls.message.setValue('');

    this.isLoading.set(true);
    this.errorMessage.set('');

    const history: GeminiChatMessage[] = this.chatBubbles().map((bubble) => ({
      role: bubble.role,
      text: bubble.text
    }));

    this.gemini
      .sendChat(apiKey, history, {
        systemInstruction:
          'You are a concise assistant. Keep responses short and factual unless asked for detail.'
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (responseText) => {
          const modelMessage: ChatBubble = {
            role: 'model',
            text: responseText,
            timestamp: new Date().toISOString()
          };
          this.chatBubbles.update((messages) => [...messages, modelMessage]);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
        }
      });
  }

  clearChat(): void {
    this.chatBubbles.set([]);
    this.errorMessage.set('');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return `Gemini request failed: ${error.message}`;
    }

    return 'Gemini request failed. Check your API key and network connectivity.';
  }
}
