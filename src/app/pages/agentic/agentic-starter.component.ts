import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ChatTurn {
  readonly id: number;
  readonly role: 'USER' | 'AGENT';
  readonly text: string;
}

interface AgentStep {
  readonly title: string;
  readonly detail: string;
}

interface AgentReply {
  readonly message: string;
  readonly options: readonly string[];
  readonly steps: readonly AgentStep[];
}

@Component({
  selector: 'app-agentic-starter',
  imports: [ReactiveFormsModule],
  template: `
    <main class="agentic-page">
      <header class="hero">
        <p class="eyebrow">Agentic Apps with Genkit + Angular</p>
        <h1>Starter Kit Playground</h1>
        <p class="intro">
          This page mirrors the starter-kit workflow: keep a session, send user intent,
          let an agent reason in steps, and return a response plus follow-up options.
        </p>
      </header>

      <section class="grid" aria-label="Agentic starter experience">
        <article class="panel workflow-panel">
          <h2>Workflow</h2>
          <ol>
            @for (step of activeSteps(); track step.title) {
              <li>
                <strong>{{ step.title }}</strong>
                <p>{{ step.detail }}</p>
              </li>
            }
          </ol>
          <div class="session-chip" aria-live="polite">Session: {{ sessionId() }}</div>
        </article>

        <article class="panel chat-panel" aria-label="Agent chat panel">
          <h2>Agent Chat</h2>

          <div class="history" aria-live="polite" aria-busy="{{ thinking() }}">
            @for (turn of chat(); track turn.id) {
              <div class="bubble-row" [class.bubble-row-user]="turn.role === 'USER'">
                <p class="bubble" [class.bubble-user]="turn.role === 'USER'">
                  <span class="tag">{{ turn.role }}</span>
                  <span>{{ turn.text }}</span>
                </p>
              </div>
            }
          </div>

          <form class="composer" (ngSubmit)="submitPrompt()">
            <label for="agentic-prompt">Ask the starter agent</label>
            <div class="composer-row">
              <input
                id="agentic-prompt"
                type="text"
                [formControl]="promptControl"
                placeholder="Try: Plan a 2-day Berlin city break"
              />
              <button type="submit" [disabled]="!canSubmit()">Send</button>
            </div>
          </form>

          @if (options().length > 0) {
            <div class="options" aria-label="Suggested follow-up options">
              <h3>Quick options</h3>
              <div class="chips">
                @for (option of options(); track option) {
                  <button type="button" (click)="submitPrompt(option)" [disabled]="thinking()">
                    {{ option }}
                  </button>
                }
              </div>
            </div>
          }

          @if (thinking()) {
            <p class="thinking" role="status">Agent is reasoning and selecting next actions...</p>
          }
        </article>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .agentic-page {
        min-height: 100dvh;
        padding: 2rem;
        color: #112221;
        background:
          radial-gradient(circle at 8% 18%, #f8e9d3 0%, transparent 45%),
          radial-gradient(circle at 88% 6%, #d5efe7 0%, transparent 35%),
          linear-gradient(145deg, #f6f8f6, #e7f0ed);
      }

      .hero {
        max-width: 65ch;
        margin-bottom: 1.5rem;
      }

      .eyebrow {
        margin: 0;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 700;
        color: #1f5a4e;
      }

      h1 {
        margin: 0.4rem 0;
        font-size: clamp(1.9rem, 2.8vw, 3rem);
      }

      .intro {
        margin: 0;
        line-height: 1.5;
      }

      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: minmax(240px, 340px) minmax(0, 1fr);
      }

      .panel {
        border: 1px solid #b6cdc7;
        border-radius: 1rem;
        background: #ffffffe0;
        box-shadow: 0 10px 24px #0f2f2a14;
      }

      .workflow-panel {
        padding: 1rem;
      }

      .workflow-panel h2,
      .chat-panel h2 {
        margin: 0 0 0.8rem;
      }

      ol {
        margin: 0;
        padding-left: 1.2rem;
      }

      li + li {
        margin-top: 0.65rem;
      }

      li p {
        margin: 0.25rem 0 0;
        color: #3c4b48;
      }

      .session-chip {
        margin-top: 1rem;
        font-size: 0.85rem;
        font-weight: 700;
        background: #e7f4f0;
        border: 1px solid #9cc4b7;
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
        display: inline-block;
      }

      .chat-panel {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
      }

      .history {
        min-height: 18rem;
        max-height: 27rem;
        overflow: auto;
        padding: 0.8rem;
        border: 1px solid #c6d9d3;
        border-radius: 0.85rem;
        background: #f8fcfb;
      }

      .bubble-row {
        display: flex;
        justify-content: flex-start;
      }

      .bubble-row + .bubble-row {
        margin-top: 0.6rem;
      }

      .bubble-row-user {
        justify-content: flex-end;
      }

      .bubble {
        max-width: min(75ch, 100%);
        margin: 0;
        display: inline-grid;
        gap: 0.25rem;
        padding: 0.65rem 0.8rem;
        border-radius: 0.8rem;
        border: 1px solid #bed3cd;
        background: #eef8f4;
      }

      .bubble-user {
        background: #f2efe4;
        border-color: #d0c9b1;
      }

      .tag {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #2c5750;
      }

      .composer {
        display: grid;
        gap: 0.45rem;
      }

      label {
        font-weight: 700;
      }

      .composer-row {
        display: grid;
        gap: 0.6rem;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      input {
        border: 1px solid #95b8af;
        border-radius: 0.65rem;
        padding: 0.65rem 0.8rem;
        font-size: 1rem;
      }

      input:focus-visible,
      button:focus-visible {
        outline: 3px solid #1e6d8a;
        outline-offset: 2px;
      }

      button {
        border: 1px solid #0b5f6f;
        border-radius: 0.65rem;
        background: #0f7487;
        color: #ffffff;
        padding: 0.65rem 0.95rem;
        font-weight: 700;
        cursor: pointer;
      }

      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .options h3 {
        margin: 0;
        font-size: 0.95rem;
      }

      .chips {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
      }

      .chips button {
        background: #ffffff;
        border-color: #8eb6ab;
        color: #1b4f46;
      }

      .thinking {
        margin: 0;
        font-weight: 700;
        color: #145e73;
      }

      @media (max-width: 900px) {
        .agentic-page {
          padding: 1rem;
        }

        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgenticStarterComponent {
  readonly promptControl = new FormControl('', { nonNullable: true });

  readonly sessionId = signal(this.makeSessionId());
  readonly thinking = signal(false);

  readonly chat = signal<readonly ChatTurn[]>([
    {
      id: 1,
      role: 'AGENT',
      text: 'Welcome! I am your starter agent. Share a goal and I will run a mini agentic workflow.'
    }
  ]);

  readonly options = signal<readonly string[]>([
    'Plan a 2-day city break',
    'Design a one-week learning plan',
    'Create a launch checklist for a feature'
  ]);

  readonly activeSteps = signal<readonly AgentStep[]>([
    {
      title: '1. Collect intent',
      detail: 'Capture user goal and keep session context.'
    },
    {
      title: '2. Reason in steps',
      detail: 'Break work into plan, assumptions, and next best action.'
    },
    {
      title: '3. Use tools',
      detail: 'Optionally call tools (date/time, search, API) before response.'
    },
    {
      title: '4. Return options',
      detail: 'Respond with suggested follow-ups to keep the workflow moving.'
    }
  ]);

  readonly canSubmit = computed(
    () => this.promptControl.value.trim().length > 0 && !this.thinking()
  );

  async submitPrompt(option?: string): Promise<void> {
    const value = (option ?? this.promptControl.value).trim();
    if (!value || this.thinking()) {
      return;
    }

    this.thinking.set(true);
    this.pushTurn('USER', value);
    this.promptControl.setValue('');

    await this.delay(500);
    const reply = this.buildReply(value);

    this.activeSteps.set(reply.steps);
    this.options.set(reply.options);
    this.pushTurn('AGENT', reply.message);
    this.thinking.set(false);
  }

  private pushTurn(role: ChatTurn['role'], text: string): void {
    const nextTurn: ChatTurn = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      role,
      text
    };
    this.chat.update((current) => [...current, nextTurn]);
  }

  private buildReply(input: string): AgentReply {
    const lower = input.toLowerCase();

    const toolStep: AgentStep = lower.includes('today') || lower.includes('date')
      ? {
          title: '3. Tool selected',
          detail: 'Using date/time helper to anchor the response to today.'
        }
      : {
          title: '3. Tool selected',
          detail: 'No external tool needed; using in-session reasoning only.'
        };

    const message = [
      'Agent summary:',
      `I parsed your goal as: "${input}".`,
      'Proposed flow: identify the outcome, split into 3 practical steps, then pick the highest-value next action.',
      'Next action: confirm your constraints (time, budget, and quality bar) so the plan can be optimized.'
    ].join(' ');

    return {
      message,
      options: [
        'Use a fast plan (MVP)',
        'Add stricter constraints',
        'Generate a detailed step-by-step execution list'
      ],
      steps: [
        {
          title: '1. Intent parsed',
          detail: `Goal captured from user input: "${input}".`
        },
        {
          title: '2. Plan drafted',
          detail: 'Drafted a short plan with outcome, constraints, and milestones.'
        },
        toolStep,
        {
          title: '4. Follow-up offered',
          detail: 'Returned option chips to continue the workflow without retyping.'
        }
      ]
    };
  }

  private makeSessionId(): string {
    return `sess-${Math.floor(Date.now() / 1000).toString(36)}-${Math.floor(
      Math.random() * 1_000_000
    ).toString(36)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
