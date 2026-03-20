import { ChangeDetectionStrategy, Component, Renderer2, effect, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private renderer = inject(Renderer2);

  readonly darkMode = signal(this.#getInitialMode());

  constructor() {
    effect(() => {
      const dark = this.darkMode();
      if (dark) {
        this.renderer.addClass(document.body, 'dark-theme');
      } else {
        this.renderer.removeClass(document.body, 'dark-theme');
      }
      localStorage.setItem('ng21-theme', dark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.darkMode.update(v => !v);
  }

  #getInitialMode(): boolean {
    const saved = localStorage.getItem('ng21-theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
