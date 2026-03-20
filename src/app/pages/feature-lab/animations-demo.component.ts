import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DemoChip {
  readonly id: number;
  readonly label: string;
}

@Component({
  selector: 'app-animations-demo',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>Angular animations with animate.enter and animate.leave</h1>
      <p>
        This demo follows the Angular animations guide using enter and leave class hooks.
      </p>

      <section class="panel" aria-labelledby="panel-title">
        <h2 id="panel-title">Enter and leave animation</h2>
        <button type="button" (click)="isPanelVisible.update((visible) => !visible)">
          {{ isPanelVisible() ? 'Hide panel' : 'Show panel' }}
        </button>

        @if (isPanelVisible()) {
          <article class="animated-card" animate.enter="panel-enter" animate.leave="panel-leave">
            <h3>Animated panel</h3>
            <p>
              The panel fades and lifts in on enter, then fades out and slides down on leave.
            </p>
          </article>
        }
      </section>

      <section class="chip-lab" aria-labelledby="chip-title">
        <h2 id="chip-title">Animated list items</h2>
        <div class="controls">
          <button type="button" (click)="addChip()">Add chip</button>
          <button type="button" (click)="removeLatestChip()" [disabled]="chips().length === 0">
            Remove latest chip
          </button>
        </div>

        <div class="chip-list" role="list" aria-label="Animated chips">
          @for (chip of chips(); track chip.id) {
            <span class="chip" role="listitem" animate.enter="chip-enter" animate.leave="chip-leave">
              {{ chip.label }}
            </span>
          }
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: linear-gradient(160deg, #f3f8ff, #eaf8f0);
        color: #12332a;
      }

      h1 {
        margin: 0.5rem 0 0.6rem;
        font-size: clamp(1.4rem, 2.5vw, 2.15rem);
      }

      p {
        line-height: 1.45;
      }

      .panel,
      .chip-lab {
        margin-top: 1.1rem;
        border: 1px solid #a3c5b9;
        border-radius: 0.8rem;
        padding: 0.95rem;
        background: #ffffffd9;
      }

      button {
        border: 1px solid #4f786b;
        border-radius: 0.45rem;
        background: #f7fffb;
        color: #13342c;
        padding: 0.4rem 0.7rem;
      }

      button[disabled] {
        opacity: 0.55;
      }

      .animated-card {
        margin-top: 0.8rem;
        border: 1px solid #9db8e4;
        border-radius: 0.75rem;
        background: #f7faff;
        padding: 0.8rem;
      }

      .animated-card h3 {
        margin: 0;
      }

      .animated-card p {
        margin: 0.45rem 0 0;
      }

      .controls {
        display: flex;
        gap: 0.55rem;
      }

      .chip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        margin-top: 0.8rem;
      }

      .chip {
        border-radius: 999px;
        padding: 0.3rem 0.7rem;
        border: 1px solid #79a9a2;
        background: #ecfaf5;
        font-size: 0.9rem;
      }

      .panel-enter {
        animation: panel-enter-keyframes 280ms ease-out;
      }

      .panel-leave {
        animation: panel-leave-keyframes 220ms ease-in forwards;
      }

      .chip-enter {
        animation: chip-enter-keyframes 180ms ease-out;
      }

      .chip-leave {
        animation: chip-leave-keyframes 160ms ease-in forwards;
      }

      @keyframes panel-enter-keyframes {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes panel-leave-keyframes {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(12px);
        }
      }

      @keyframes chip-enter-keyframes {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes chip-leave-keyframes {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.9);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .panel-enter,
        .panel-leave,
        .chip-enter,
        .chip-leave {
          animation-duration: 1ms;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationsDemoComponent {
  readonly isPanelVisible = signal(true);
  readonly nextChipId = signal(4);
  readonly chips = signal<readonly DemoChip[]>([
    { id: 1, label: 'Fade + slide' },
    { id: 2, label: 'List enter' },
    { id: 3, label: 'List leave' }
  ]);

  addChip(): void {
    const id = this.nextChipId();
    this.chips.update((chips) => [...chips, { id, label: `Chip ${id}` }]);
    this.nextChipId.update((value) => value + 1);
  }

  removeLatestChip(): void {
    this.chips.update((chips) => chips.slice(0, -1));
  }
}
