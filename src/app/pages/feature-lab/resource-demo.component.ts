import {
  ChangeDetectionStrategy,
  Component,
  ResourceStatus,
  computed,
  resource,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

function pause(ms: number, abortSignal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    const onAbort = (): void => {
      clearTimeout(timeout);
      reject(new DOMException('Cancelled', 'AbortError'));
    };

    abortSignal.addEventListener('abort', onAbort, { once: true });
  });
}

@Component({
  selector: 'app-resource-demo',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>resource() async state demo</h1>

      <div class="controls">
        <button type="button" (click)="userId.update((id) => id + 1)">Next user</button>
        <button type="button" (click)="profile.reload()">Reload</button>
      </div>

      <p>Status: <strong>{{ profile.status() }}</strong></p>

      @switch (profile.status()) {
        @case ('loading') {
          <p>Loading profile...</p>
        }
        @case ('reloading') {
          <p>Refreshing profile while keeping previous value...</p>
        }
        @case ('error') {
          <p class="error">Error: {{ profile.error()?.message }}</p>
        }
        @default {
          @if (profile.hasValue()) {
            <article class="profile">
              <h2>{{ profile.value().name }}</h2>
              <p>{{ profile.value().role }}</p>
              <small>Fetched in {{ profile.value().latencyMs }} ms</small>
            </article>
          }
        }
      }

      <p>Resolved count: {{ resolvedCount() }}</p>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #f3f2ff;
        color: #211e38;
      }

      .controls {
        display: flex;
        gap: 0.75rem;
      }

      button {
        border: 1px solid #6b64a6;
        border-radius: 0.45rem;
        padding: 0.35rem 0.7rem;
        background: #fff;
      }

      .profile {
        border: 1px solid #bdb9df;
        border-radius: 0.65rem;
        padding: 0.9rem;
        max-width: 20rem;
      }

      .error {
        color: #b11b3a;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDemoComponent {
  readonly userId = signal(1);

  readonly profile = resource({
    params: () => ({ id: this.userId() }),
    loader: async ({ params, abortSignal }) => {
      const latencyMs = 500 + (params.id % 4) * 160;
      await pause(latencyMs, abortSignal);
      return {
        id: params.id,
        name: `User ${params.id}`,
        role: params.id % 2 === 0 ? 'Maintainer' : 'Reviewer',
        latencyMs
      };
    }
  });

  readonly resolvedCount = computed(() =>
    this.profile.status() === ('resolved' satisfies ResourceStatus) ? this.userId() : 0
  );
}
