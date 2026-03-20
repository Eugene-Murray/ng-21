import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-heavy-panel',
  template: `
    <article class="heavy-panel">
      <h2>Deferred panel loaded</h2>
      <p>The &#64;defer block rendered this section only after activation.</p>
      <ul>
        @for (metric of metrics; track metric.label) {
          <li>
            <strong>{{ metric.label }}:</strong>
            {{ metric.value }}
          </li>
        }
      </ul>
    </article>
  `,
  styles: [
    `
      .heavy-panel {
        border: 1px solid #beac7f;
        border-radius: 0.65rem;
        padding: 0.9rem;
        background: #fff;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeavyPanelComponent {
  readonly metrics = [
    { label: 'Bundle split point', value: 'yes' },
    { label: 'Placeholder state', value: 'visible before load' },
    { label: 'Loading state', value: 'automatic with @loading' }
  ] as const;
}

@Component({
  selector: 'app-defer-demo',
  imports: [RouterLink, HeavyPanelComponent],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>&#64;defer demo</h1>
      <p>
        This pattern is central to incremental hydration strategies introduced in the 19-20 timeline.
      </p>

      <button type="button" (click)="active.set(true)">Activate deferred content</button>

      @defer (when active()) {
        <app-heavy-panel />
      } @placeholder (minimum 300ms) {
        <p class="placeholder">Deferred content is waiting for activation.</p>
      } @loading (minimum 250ms) {
        <p class="loading">Loading deferred content...</p>
      }
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #fff6ea;
        color: #32210b;
      }

      button {
        border: 1px solid #9f7542;
        border-radius: 0.45rem;
        background: #fff;
        padding: 0.35rem 0.7rem;
      }

      .placeholder,
      .loading {
        margin-top: 0.8rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeferDemoComponent {
  readonly active = signal(false);
}
