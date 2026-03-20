import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal
} from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface DemoUser {
  readonly id: number;
  readonly name: string;
  readonly team: string;
}

@Component({
  selector: 'app-http-resource-demo',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>httpResource() demo</h1>

      <label for="search">Filter users</label>
      <input id="search" type="text" [value]="query()" (input)="setQuery($event)" />
      <button type="button" (click)="refreshKey.update((value) => value + 1)">Refresh</button>

      <p>Status: <strong>{{ users.status() }}</strong></p>
      @if (users.error()) {
        <p class="error">Error: {{ users.error()?.message }}</p>
      }

      <ul>
        @for (user of filteredUsers(); track user.id) {
          <li>{{ user.name }} <small>({{ user.team }})</small></li>
        } @empty {
          <li>No users match this query.</li>
        }
      </ul>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #edf5ff;
        color: #0f2138;
      }

      input {
        margin: 0.6rem 0.5rem 1rem 0;
        padding: 0.35rem;
      }

      button {
        border: 1px solid #4d78ab;
        border-radius: 0.45rem;
        background: #fff;
        padding: 0.35rem 0.65rem;
      }

      .error {
        color: #b22b2b;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HttpResourceDemoComponent {
  readonly query = signal('');
  readonly refreshKey = signal(0);

  readonly users = httpResource<readonly DemoUser[]>(
    () => `/users.json?refresh=${this.refreshKey()}`,
    {
      defaultValue: []
    }
  );

  readonly filteredUsers = computed(() => {
    const filter = this.query().trim().toLowerCase();
    if (!filter) {
      return this.users.value();
    }

    return this.users
      .value()
      .filter((user) => user.name.toLowerCase().includes(filter) || user.team.toLowerCase().includes(filter));
  });

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
