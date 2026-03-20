import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked
} from '@angular/core';
import { RouterLink } from '@angular/router';

type TeamKey = 'frontend' | 'platform' | 'design';

@Component({
  selector: 'app-signals',
  imports: [RouterLink],
  template: `
    <main class="signals-page">
      <header class="hero">
        <p class="eyebrow">Angular Signals</p>
        <h1>Signals Feature Explorer</h1>
        <p>
          This page demonstrates core signal APIs from the guide: <strong>signal()</strong>,
          <strong>computed()</strong>, <strong>linkedSignal()</strong>,
          <strong>effect()</strong>, and <strong>untracked()</strong>.
        </p>
      </header>

      <section class="card" aria-labelledby="writable-computed">
        <h2 id="writable-computed">Writable + Computed Signals</h2>
        <div class="row">
          <button type="button" (click)="decrement()">-{{ step() }}</button>
          <strong class="pill">Count: {{ count() }}</strong>
          <button type="button" (click)="increment()">+{{ step() }}</button>
        </div>
        <label for="step">Step</label>
        <input
          id="step"
          type="range"
          min="1"
          max="5"
          [value]="step()"
          (input)="setStep($event)"
        />
        <p>Double (computed): {{ doubled() }}</p>
        <p>Parity (computed): {{ parity() }}</p>
      </section>

      <section class="card" aria-labelledby="linked-signal-title">
        <h2 id="linked-signal-title">linkedSignal()</h2>
        <p>
          The selected person is writable, but it resets whenever the active team changes.
        </p>
        <div class="row wrap" role="group" aria-label="Select a team">
          @for (team of teamKeys; track team) {
            <button
              type="button"
              [class.active]="activeTeam() === team"
              (click)="activeTeam.set(team)"
            >
              {{ team }}
            </button>
          }
        </div>

        <label for="member">Selected member</label>
        <select
          id="member"
          [value]="selectedMember()"
          (change)="setSelectedMember($event)"
        >
          @for (member of activeMembers(); track member) {
            <option [value]="member">{{ member }}</option>
          }
        </select>

        <p>Current selection: {{ selectedMember() }}</p>
      </section>

      <section class="card" aria-labelledby="effect-title">
        <h2 id="effect-title">effect() + untracked()</h2>
        <p>
          An effect updates the document title from tracked state. The note below is read with
          untracked(), so changing it alone will not rerun title logic.
        </p>
        <label for="label">Title label</label>
        <input id="label" [value]="label()" (input)="setLabel($event)" />

        <label for="note">Note (untracked)</label>
        <input id="note" [value]="note()" (input)="setNote($event)" />

        <p class="meta">Preview: {{ titlePreview() }}</p>
      </section>

      <a class="back-link" routerLink="/feature-lab">Back to Feature Lab</a>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .signals-page {
        min-height: 100%;
        padding: 1.5rem;
        color: #142225;
        background:
          radial-gradient(circle at 12% 12%, #fff7c2 0%, rgba(255, 247, 194, 0) 28%),
          radial-gradient(circle at 88% 18%, #c8f1ff 0%, rgba(200, 241, 255, 0) 36%),
          linear-gradient(145deg, #f7fbff 0%, #f7fdf8 100%);
      }

      .hero {
        margin-bottom: 1rem;
        max-width: 64rem;
      }

      .eyebrow {
        margin: 0;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #305f6d;
        font-weight: 700;
      }

      h1 {
        margin: 0.35rem 0;
        font-size: clamp(1.5rem, 3vw, 2.2rem);
      }

      .card {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #c7dbe1;
        border-radius: 0.9rem;
        background: rgba(255, 255, 255, 0.82);
      }

      .row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.6rem;
      }

      .row.wrap {
        flex-wrap: wrap;
      }

      .pill {
        display: inline-block;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        background: #edf7ff;
        border: 1px solid #bfd7eb;
      }

      button,
      select,
      input {
        font: inherit;
      }

      button {
        border: 1px solid #5a8a95;
        border-radius: 0.6rem;
        background: #ffffff;
        padding: 0.45rem 0.8rem;
        color: #17353d;
        font-weight: 600;
      }

      button.active {
        background: #1d6f78;
        color: #ffffff;
        border-color: #1d6f78;
      }

      input,
      select {
        display: block;
        margin: 0.25rem 0 0.65rem;
        width: min(26rem, 100%);
        border: 1px solid #aec5cd;
        border-radius: 0.5rem;
        padding: 0.45rem 0.55rem;
        background: #fcfeff;
      }

      .meta {
        color: #35565e;
      }

      .back-link {
        display: inline-block;
        margin-top: 1rem;
        font-weight: 600;
        color: #0b5e71;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalsComponent {
  private readonly document = inject(DOCUMENT);

  readonly count = signal(0);
  readonly step = signal(1);
  readonly label = signal('Signals demo');
  readonly note = signal('This note is untracked in the effect.');

  readonly teams: Readonly<Record<TeamKey, readonly string[]>> = {
    frontend: ['Amina', 'Noah', 'Iris'],
    platform: ['Luca', 'Marta', 'Kenji'],
    design: ['Rita', 'Nadia', 'Pavel']
  };

  readonly teamKeys: readonly TeamKey[] = ['frontend', 'platform', 'design'];
  readonly activeTeam = signal<TeamKey>('frontend');

  readonly activeMembers = computed(() => this.teams[this.activeTeam()]);
  readonly selectedMember = linkedSignal<string>(() => this.activeMembers()[0]);

  readonly doubled = computed(() => this.count() * 2);
  readonly parity = computed(() => (this.count() % 2 === 0 ? 'even' : 'odd'));

  readonly titlePreview = computed(
    () => `${this.label()} - ${this.count()} (${untracked(() => this.note())})`
  );

  constructor() {
    effect(() => {
      this.document.title = `${this.label()} | Count ${this.count()}`;
      untracked(() => this.note());
    });
  }

  increment(): void {
    this.count.update((value) => value + this.step());
  }

  decrement(): void {
    this.count.update((value) => Math.max(0, value - this.step()));
  }

  setStep(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.step.set(Number.isFinite(value) ? value : 1);
  }

  setLabel(event: Event): void {
    this.label.set((event.target as HTMLInputElement).value);
  }

  setNote(event: Event): void {
    this.note.set((event.target as HTMLInputElement).value);
  }

  setSelectedMember(event: Event): void {
    this.selectedMember.set((event.target as HTMLSelectElement).value);
  }
}