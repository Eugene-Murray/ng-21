import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FeatureCard {
  readonly title: string;
  readonly version: string;
  readonly description: string;
  readonly route: string;
}

@Component({
  selector: 'app-feature-lab-home',
  imports: [RouterLink],
  template: `
    <main class="lab-page">
      <section class="hero">
        <h1>Angular 19-21 Feature Lab</h1>
        <p>
          A hands-on playground for the major APIs and patterns introduced or matured
          across Angular 19, 20, and 21.
        </p>
      </section>

      <section class="cards" aria-label="Angular feature demos">
        @for (feature of features; track feature.route) {
          <a class="card" [routerLink]="feature.route">
            <span class="version">{{ feature.version }}</span>
            <h2>{{ feature.title }}</h2>
            <p>{{ feature.description }}</p>
          </a>
        }
      </section>

      <section class="quick-links" aria-label="Other routes">
        <a routerLink="/todo">Existing Todo demo</a>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .lab-page {
        min-height: 100dvh;
        padding: 2rem;
        background: linear-gradient(145deg, #f7f7ed, #ecf4f4);
        color: #122121;
      }

      .hero {
        max-width: 54rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(1.8rem, 2.6vw, 2.8rem);
      }

      .hero p {
        margin-top: 0.75rem;
        line-height: 1.5;
      }

      .cards {
        margin-top: 1.5rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .card {
        display: block;
        text-decoration: none;
        color: inherit;
        border: 1px solid #b9d0cb;
        border-radius: 0.85rem;
        padding: 1rem;
        background: #ffffffcc;
        transition: transform 120ms ease, box-shadow 120ms ease;
      }

      .card:hover,
      .card:focus-visible {
        transform: translateY(-2px);
        box-shadow: 0 8px 22px #16333322;
        outline: none;
      }

      .version {
        font-size: 0.8rem;
        color: #255f54;
        font-weight: 700;
      }

      h2 {
        margin: 0.4rem 0 0.35rem;
        font-size: 1.15rem;
      }

      p {
        margin: 0;
        line-height: 1.4;
      }

      .quick-links {
        margin-top: 1.5rem;
      }

      .quick-links a {
        color: #0f5e73;
        font-weight: 600;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureLabHomeComponent {
  readonly features: readonly FeatureCard[] = [
    {
      title: 'input(), model(), output()',
      version: 'v19',
      description: 'Modern component I/O without decorators, including two-way model binding.',
      route: '/features/io-model'
    },
    {
      title: 'linkedSignal',
      version: 'v20',
      description: 'Writable derived state that resets when source state changes.',
      route: '/features/linked-signal'
    },
    {
      title: 'resource()',
      version: 'v19+',
      description: 'Signal-native async loading with status, cancellation, and reload support.',
      route: '/features/resource'
    },
    {
      title: 'httpResource()',
      version: 'v19.2+',
      description: 'Reactive HTTP powered by HttpClient and signals.',
      route: '/features/http-resource'
    },
    {
      title: 'afterRenderEffect + signal queries',
      version: 'v20',
      description: 'DOM read/write work scheduled after render using signal-based view queries.',
      route: '/features/render-effects'
    },
    {
      title: '@defer with loading states',
      version: 'v19-20 usage',
      description: 'Deferred rendering pattern that powers incremental hydration strategies.',
      route: '/features/defer'
    },
    {
      title: 'animate.enter and animate.leave',
      version: 'v20.2+',
      description: 'Modern Angular animations with CSS keyframes for enter/leave transitions.',
      route: '/features/animations'
    },
    {
      title: 'Agentic starter workflow',
      version: 'v21 + Genkit pattern',
      description:
        'Starter page inspired by Genkit + Angular chat flows with session context and stepwise agent actions.',
      route: '/features/agentic-starter'
    },
    {
      title: 'AI Text Editor template',
      version: 'Gemini API',
      description:
        'Prompt-based text refinement, expansion, and formalization via Gemini HTTP calls.',
      route: '/ai-text-editor'
    },
    {
      title: 'AI Chatbot template',
      version: 'Gemini API',
      description:
        'Chat UI starter that sends conversation history to Gemini and renders model replies.',
      route: '/ai-chatbot'
    },
    {
      title: 'Angular ARIA Showcase',
      version: 'v21',
      description:
        'A full CDK a11y tour: focus monitoring, focus trap, keyboard manager, and live regions.',
      route: '/aria-showcase'
    },
    {
      title: 'RxJS Examples',
      version: 'RxJS 7.8',
      description:
        '35+ interactive operator demos across 7 categories — Creation, Transformation, Filtering, Combination, Error Handling, Multicasting, and Utility.',
      route: '/rxjs-examples'
    }
  ];
}
