import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface Team {
  readonly id: number;
  readonly name: string;
  readonly members: readonly string[];
}

@Component({
  selector: 'app-linked-signal-demo',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>linkedSignal demo</h1>
      <p>
        The selected member is writable, but it automatically resets when the active team changes.
      </p>

      <section class="teams" aria-label="Team list">
        @for (team of teams; track team.id) {
          <button type="button" [class.active]="activeTeamId() === team.id" (click)="activeTeamId.set(team.id)">
            {{ team.name }}
          </button>
        }
      </section>

      <section class="members">
        <h2>{{ activeTeam().name }} members</h2>
        @for (member of activeTeam().members; track member) {
          <button type="button" [class.active]="selectedMember() === member" (click)="selectedMember.set(member)">
            {{ member }}
          </button>
        }
      </section>

      <p>Selected: <strong>{{ selectedMember() }}</strong></p>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #edf7f2;
        color: #143127;
      }

      .teams,
      .members {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
        margin: 1rem 0;
      }

      button {
        border: 1px solid #5d8a79;
        border-radius: 999px;
        padding: 0.3rem 0.75rem;
        background: #fff;
      }

      button.active {
        background: #0f6f53;
        color: #fff;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkedSignalDemoComponent {
  readonly teams: readonly Team[] = [
    { id: 1, name: 'Frontend', members: ['Amina', 'Noah', 'Iris'] },
    { id: 2, name: 'API', members: ['Luca', 'Marta', 'Owen'] },
    { id: 3, name: 'Data', members: ['Kenji', 'Sara', 'Nadia'] }
  ];

  readonly activeTeamId = signal(1);

  readonly activeTeam = computed(() =>
    this.teams.find((team) => team.id === this.activeTeamId()) ?? this.teams[0]
  );

  readonly selectedMember = linkedSignal<string>(() => this.activeTeam().members[0]);
}
