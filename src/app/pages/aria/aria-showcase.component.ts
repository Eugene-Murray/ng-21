import {
  ActiveDescendantKeyManager,
  A11yModule,
  AriaDescriber,
  FocusMonitor,
  FocusOrigin,
  HighContrastModeDetector,
  LiveAnnouncer
} from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

class AriaOptionItem {
  constructor(readonly id: string, readonly label: string) {}

  disabled = false;

  getLabel(): string {
    return this.label;
  }

  setActiveStyles(): void {
    // Visual active styles are bound through activeIndex() in the template.
  }

  setInactiveStyles(): void {
    // Visual active styles are bound through activeIndex() in the template.
  }
}

@Component({
  selector: 'app-aria-showcase',
  imports: [RouterLink, A11yModule],
  template: `
    <main class="aria-page" aria-labelledby="aria-title">
      <header class="hero">
        <p class="eyebrow">Angular CDK A11y</p>
        <h1 id="aria-title">ARIA Components Showcase</h1>
        <p>
          This page demonstrates the major accessibility primitives from
          <strong>@angular/cdk/a11y</strong> with practical, keyboard-first examples.
        </p>
      </header>

      <section class="card" aria-labelledby="live-announcer-title">
        <h2 id="live-announcer-title">LiveAnnouncer + AriaDescriber</h2>
        <p id="announce-help">
          Trigger an announcement for screen readers and attach descriptive ARIA text to a
          control at runtime.
        </p>
        <div class="row">
          <button type="button" (click)="announceUpdate()">Announce update</button>
          <button type="button" (click)="toggleDescription()">
            {{ describeCta() ? 'Remove' : 'Add' }} extra description
          </button>
        </div>
        <p class="status">Last announcement: {{ lastAnnouncement() }}</p>
        <button #describedButton type="button" class="ghost">Described button target</button>
      </section>

      <section class="card" aria-labelledby="focus-monitor-title">
        <h2 id="focus-monitor-title">FocusMonitor</h2>
        <p>
          Focus origin is detected as keyboard, mouse, touch, program, or null (blur).
        </p>
        <div class="row wrap">
          <button #focusTarget type="button">Monitor my focus</button>
          <button type="button" (click)="focusViaKeyboard()">Programmatic keyboard focus</button>
        </div>
        <p class="status">Current focus origin: {{ focusOriginLabel() }}</p>
      </section>

      <section class="card" aria-labelledby="focus-trap-title">
        <h2 id="focus-trap-title">cdkTrapFocus</h2>
        <p>
          When enabled, Tab/Shift+Tab stay inside the panel until the trap is turned off.
        </p>
        <label class="checkline">
          <input type="checkbox" [checked]="trapEnabled()" (change)="toggleTrap($event)" />
          Enable focus trap
        </label>

        <div class="trap-box" cdkTrapFocus [cdkTrapFocusAutoCapture]="trapEnabled()">
          <button type="button">Trap action A</button>
          <button type="button">Trap action B</button>
          <a href="#" (click)="$event.preventDefault()">Focusable link</a>
          <input type="text" placeholder="Focusable input" />
        </div>
      </section>

      <section class="card" aria-labelledby="keyboard-list-title">
        <h2 id="keyboard-list-title">ActiveDescendantKeyManager</h2>
        <p>
          Use Up/Down arrows, Home/End, or typeahead to navigate the listbox options.
        </p>
        <div
          class="listbox"
          role="listbox"
          tabindex="0"
          [attr.aria-activedescendant]="activeOptionId()"
          aria-label="ARIA showcase options"
          (keydown)="onListboxKeydown($event)"
        >
          @for (option of keyboardOptions(); track option.id; let idx = $index) {
            <div
              #listOption
              class="list-option"
              role="option"
              [id]="option.id"
              [attr.aria-selected]="activeIndex() === idx"
              [class.is-active]="activeIndex() === idx"
            >
              {{ option.label }}
            </div>
          }
        </div>
      </section>

      <section class="card" aria-labelledby="contrast-title">
        <h2 id="contrast-title">HighContrastModeDetector</h2>
        <p>
          High contrast mode detected: <strong>{{ highContrastMode() }}</strong>
        </p>
      </section>

      <a class="back-link" routerLink="/feature-lab">Back to Feature Lab</a>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .aria-page {
        min-height: 100%;
        padding: 1.5rem;
        color: #122129;
        background:
          radial-gradient(circle at 8% 14%, #ffecc6 0%, rgba(255, 236, 198, 0) 26%),
          radial-gradient(circle at 84% 12%, #d5f0ff 0%, rgba(213, 240, 255, 0) 32%),
          linear-gradient(155deg, #f8fbff, #f3faf6 55%, #fff8ef);
      }

      .hero {
        max-width: 64rem;
      }

      .eyebrow {
        margin: 0;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
        color: #345c7a;
      }

      h1 {
        margin: 0.35rem 0;
        font-size: clamp(1.5rem, 3vw, 2.3rem);
      }

      .card {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 0.95rem;
        border: 1px solid #c4dbe6;
        background: #ffffffd9;
      }

      .row {
        display: flex;
        gap: 0.6rem;
        align-items: center;
      }

      .row.wrap {
        flex-wrap: wrap;
      }

      .status {
        margin: 0.55rem 0;
        color: #35535f;
      }

      button,
      input,
      a {
        font: inherit;
      }

      button,
      .ghost,
      .listbox {
        border: 1px solid #93b7c7;
        border-radius: 0.55rem;
      }

      button {
        padding: 0.45rem 0.8rem;
        background: #f7fcff;
        color: #153644;
        font-weight: 600;
      }

      .ghost {
        margin-top: 0.5rem;
        background: #ffffff;
      }

      .checkline {
        display: inline-flex;
        gap: 0.4rem;
        align-items: center;
      }

      .trap-box {
        margin-top: 0.6rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 0.55rem;
        padding: 0.75rem;
        border-radius: 0.65rem;
        border: 1px dashed #95b4c2;
        background: #f8fcff;
      }

      .trap-box input {
        border: 1px solid #93b7c7;
        border-radius: 0.45rem;
        padding: 0.45rem;
      }

      .listbox {
        margin-top: 0.5rem;
        background: #fafdff;
        padding: 0.35rem;
        max-width: 30rem;
        outline: none;
      }

      .listbox:focus-visible {
        box-shadow: 0 0 0 3px #8fc8ff;
      }

      .list-option {
        padding: 0.5rem 0.65rem;
        border-radius: 0.45rem;
      }

      .list-option.is-active {
        background: #1f6f8f;
        color: #ffffff;
      }

      .back-link {
        display: inline-block;
        margin-top: 1rem;
        color: #0b5e71;
        font-weight: 700;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AriaShowcaseComponent implements AfterViewInit, OnDestroy {
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly ariaDescriber = inject(AriaDescriber);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly contrastDetector = inject(HighContrastModeDetector);

  @ViewChild('focusTarget', { read: ElementRef })
  private readonly focusTarget?: ElementRef<HTMLElement>;

  @ViewChild('describedButton', { read: ElementRef })
  private readonly describedButton?: ElementRef<HTMLElement>;

  readonly lastAnnouncement = signal('None yet.');
  readonly focusOrigin = signal<FocusOrigin>(null);
  readonly trapEnabled = signal(true);
  readonly describeCta = signal(false);

  readonly keyboardOptions = signal<readonly AriaOptionItem[]>([
    new AriaOptionItem('aria-opt-1', 'Landmarks and regions'),
    new AriaOptionItem('aria-opt-2', 'Forms and labels'),
    new AriaOptionItem('aria-opt-3', 'Keyboard interactions'),
    new AriaOptionItem('aria-opt-4', 'Live region announcements'),
    new AriaOptionItem('aria-opt-5', 'Focus management patterns')
  ]);
  readonly activeIndex = signal(0);

  readonly focusOriginLabel = computed(() => this.focusOrigin() ?? 'none');
  readonly activeOptionId = computed(
    () => this.keyboardOptions()[this.activeIndex()]?.id ?? null
  );
  readonly highContrastMode = signal(this.contrastDetector.getHighContrastMode());

  private keyManager = new ActiveDescendantKeyManager<AriaOptionItem>([])
    .withTypeAhead()
    .withHomeAndEnd();

  ngAfterViewInit(): void {
    if (this.focusTarget) {
      this.focusMonitor
        .monitor(this.focusTarget)
        .subscribe((origin) => this.focusOrigin.set(origin));
    }

    this.rebuildKeyManager();
  }

  ngOnDestroy(): void {
    if (this.focusTarget) {
      this.focusMonitor.stopMonitoring(this.focusTarget);
    }

    if (this.describeCta() && this.describedButton) {
      this.ariaDescriber.removeDescription(
        this.describedButton.nativeElement,
        'Extra ARIA helper text attached by AriaDescriber.'
      );
    }
  }

  announceUpdate(): void {
    const message = `Accessibility update sent at ${new Date().toLocaleTimeString()}.`;
    this.lastAnnouncement.set(message);
    void this.liveAnnouncer.announce(message, 'polite');
  }

  toggleDescription(): void {
    const button = this.describedButton?.nativeElement;
    if (!button) {
      return;
    }

    const description = 'Extra ARIA helper text attached by AriaDescriber.';
    if (this.describeCta()) {
      this.ariaDescriber.removeDescription(button, description);
      this.describeCta.set(false);
      return;
    }

    this.ariaDescriber.describe(button, description);
    this.describeCta.set(true);
  }

  focusViaKeyboard(): void {
    if (this.focusTarget) {
      this.focusMonitor.focusVia(this.focusTarget, 'keyboard');
    }
  }

  toggleTrap(event: Event): void {
    this.trapEnabled.set((event.target as HTMLInputElement).checked);
  }

  onListboxKeydown(event: KeyboardEvent): void {
    this.keyManager.onKeydown(event);
    const active = this.keyManager.activeItemIndex;
    this.activeIndex.set(active ?? 0);
  }

  private rebuildKeyManager(): void {
    const options = this.keyboardOptions();
    this.keyManager = new ActiveDescendantKeyManager(options)
      .withTypeAhead()
      .withHomeAndEnd();
    this.keyManager.setActiveItem(this.activeIndex());
  }
}