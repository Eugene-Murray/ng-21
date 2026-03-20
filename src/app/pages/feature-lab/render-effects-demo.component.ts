import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  signal,
  viewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-render-effects-demo',
  imports: [RouterLink],
  template: `
    <main class="page">
      <a routerLink="/">Back to lab</a>
      <h1>afterRenderEffect + signal view query</h1>

      <label for="size">Card text size</label>
      <input
        id="size"
        type="range"
        min="14"
        max="30"
        [value]="fontSize()"
        (input)="setFontSize($event)"
      />

      <div #panel class="panel" [style.fontSize.px]="fontSize()">
        Angular rendered this panel at {{ fontSize() }}px.
      </div>

      <p>Measured panel width: {{ measuredWidth() }}px</p>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100dvh;
        padding: 1.5rem;
        background: #f4fbf8;
        color: #163129;
      }

      .panel {
        margin-top: 0.8rem;
        border: 1px solid #89b09f;
        border-radius: 0.65rem;
        background: #fff;
        width: min(100%, 34rem);
        padding: 1rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderEffectsDemoComponent {
  readonly panel = viewChild<ElementRef<HTMLDivElement>>('panel');
  readonly fontSize = signal(18);
  readonly measuredWidth = signal(0);

  constructor() {
    afterRenderEffect({
      read: () => {
        const width = this.panel()?.nativeElement.getBoundingClientRect().width ?? 0;
        this.measuredWidth.set(Math.round(width));
      }
    });
  }

  setFontSize(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.fontSize.set(Number.isFinite(value) ? value : 18);
  }
}
