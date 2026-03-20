import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-counter-stepper',
  template: `
    <div class="stepper">
      <button type="button" (click)="decrement()">-{{ step() }}</button>
      <strong>{{ count() }}</strong>
      <button type="button" (click)="increment()">+{{ step() }}</button>
    </div>
  `,
  styles: [
    `
      .stepper {
        display: inline-flex;
        gap: 0.6rem;
        align-items: center;
      }

      button {
        border: 1px solid #557a7d;
        background: #ecf5f6;
        color: #123;
        border-radius: 0.5rem;
        padding: 0.35rem 0.65rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterStepperComponent {
  readonly step = input(1);
  readonly count = model(0);
  readonly limitReached = output<number>();

  increment(): void {
    const next = this.count() + this.step();
    this.count.set(next);
    if (next >= 12) {
      this.limitReached.emit(next);
    }
  }

  decrement(): void {
    this.count.update((value) => Math.max(0, value - this.step()));
  }
}

@Component({
  selector: 'app-io-model-demo',
  imports: [CounterStepperComponent, RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>input(), model(), output() demo</h1>

      <label for="step-input">Step size</label>
      <input
        id="step-input"
        type="number"
        min="1"
        max="5"
        [value]="step()"
        (input)="setStep($event)"
      />

      <app-counter-stepper
        [step]="step()"
        [(count)]="counter"
        (limitReached)="onLimitReached($event)"
      />

      <p>Parent count value: {{ counter() }}</p>
      @if (milestone()) {
        <p class="milestone">{{ milestone() }}</p>
      }
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #f9f4ed;
        color: #261f16;
      }

      input {
        margin: 0.5rem 0 1rem;
        width: 6rem;
        padding: 0.35rem;
      }

      .milestone {
        color: #0e6f5d;
        font-weight: 700;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoModelDemoComponent {
  readonly counter = signal(0);
  readonly step = signal(2);
  readonly milestone = signal('');

  setStep(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.step.set(Number.isFinite(value) ? Math.min(5, Math.max(1, value)) : 1);
  }

  onLimitReached(value: number): void {
    this.milestone.set(`Milestone reached at ${value}.`);
  }
}
