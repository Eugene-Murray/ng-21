import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Clipboard } from '@angular/cdk/clipboard';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LiveAnnouncer, A11yModule } from '@angular/cdk/a11y';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

// ─── Custom CDK Stepper ───────────────────────────────────────────────────────

@Component({
  selector: 'app-cdk-stepper',
  imports: [CdkStepperModule, NgTemplateOutlet, MatButtonModule],
  providers: [{ provide: CdkStepper, useExisting: CdkCustomStepperComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cdk-stepper-container">
      <div class="stepper-header" role="tablist">
        @for (step of steps; track $index; let i = $index) {
          @if (i > 0) {
            <div class="step-connector" [class.filled]="i <= selectedIndex"></div>
          }
          <button
            class="step-button"
            role="tab"
            [class.active]="selectedIndex === i"
            [class.completed]="i < selectedIndex"
            (click)="selectedIndex = i"
            [attr.aria-selected]="selectedIndex === i"
          >
            <div class="step-bubble">
              @if (i < selectedIndex) { ✓ } @else { {{ i + 1 }} }
            </div>
            <span class="step-name">{{ step.label }}</span>
          </button>
        }
      </div>

      <div class="stepper-panel" role="tabpanel">
        @if (selected) {
          <ng-container [ngTemplateOutlet]="selected.content" />
        }
      </div>

      <div class="stepper-footer">
        <button mat-stroked-button [disabled]="selectedIndex === 0" (click)="previous()">
          ← Back
        </button>
        @if (selectedIndex < steps.length - 1) {
          <button mat-raised-button color="primary" (click)="next()">Next →</button>
        } @else {
          <button mat-raised-button color="accent" (click)="reset()">↺ Restart</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .cdk-stepper-container {
      border: 1px solid #d4e6c5;
      border-radius: 10px;
      overflow: hidden;
      background: #f8fbf5;
    }
    .stepper-header {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      background: #edf6e5;
      border-bottom: 1px solid #d4e6c5;
    }
    .step-connector {
      flex: 1;
      height: 2px;
      background: #d4e6c5;
      transition: background 0.3s;
    }
    .step-connector.filled { background: #1e5c4c; }
    .step-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 8px;
      color: #888;
      transition: color 0.2s;
    }
    .step-button.active,
    .step-button.completed { color: #1e5c4c; }
    .step-bubble {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #d4e6c5;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
      transition: background 0.3s, color 0.3s;
    }
    .step-button.active .step-bubble {
      background: #1e5c4c;
      color: white;
    }
    .step-button.completed .step-bubble {
      background: #2e7d63;
      color: white;
    }
    .step-name {
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .stepper-panel {
      padding: 24px;
      min-height: 120px;
    }
    .stepper-footer {
      display: flex;
      justify-content: space-between;
      padding: 16px 24px;
      border-top: 1px solid #d4e6c5;
      background: #edf6e5;
    }
  `],
})
export class CdkCustomStepperComponent extends CdkStepper {}

// ─── CDK Examples Component ───────────────────────────────────────────────────

@Component({
  selector: 'app-cdk-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    DragDropModule,
    ScrollingModule,
    OverlayModule,
    PortalModule,
    A11yModule,
    TextFieldModule,
    CdkStepperModule,
    CdkCustomStepperComponent,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatToolbarModule,
  ],
  template: `
    <mat-toolbar color="primary" class="demo-toolbar">
      <mat-icon>extension</mat-icon>
      <span style="margin-left: 8px;">Angular CDK Examples</span>
    </mat-toolbar>

    <div class="page-content">
      <mat-tab-group animationDuration="300ms" dynamicHeight>

        <!-- ── DRAG & DROP ── -->
        <mat-tab label="Drag & Drop">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Sortable List</mat-card-title>
                <mat-card-subtitle>Drag items to reorder using <code>cdkDropList</code> &amp; <code>cdkDrag</code></mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div cdkDropList class="drop-list" (cdkDropListDropped)="onSortDrop($event)">
                  @for (item of sortableList(); track item) {
                    <div cdkDrag class="drag-item">
                      <mat-icon cdkDragHandle class="drag-handle">drag_indicator</mat-icon>
                      <span>{{ item }}</span>
                      <div class="drag-placeholder" *cdkDragPlaceholder></div>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Transfer Between Lists</mat-card-title>
                <mat-card-subtitle>Drag items between connected drop lists with <code>cdkDropListConnectedTo</code></mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="transfer-lists">
                  <div class="transfer-list-wrap">
                    <p class="list-label">📋 To Do ({{ todoItems().length }})</p>
                    <div
                      id="todo-list"
                      cdkDropList
                      #todoList="cdkDropList"
                      [cdkDropListConnectedTo]="[doneList]"
                      class="drop-list todo-list"
                      (cdkDropListDropped)="onTodoDrop($event)"
                    >
                      @for (item of todoItems(); track item) {
                        <div cdkDrag class="drag-item">{{ item }}</div>
                      }
                      @if (todoItems().length === 0) {
                        <p class="empty-hint">Drop items here</p>
                      }
                    </div>
                  </div>

                  <div class="transfer-list-wrap">
                    <p class="list-label">✅ Done ({{ doneItems().length }})</p>
                    <div
                      id="done-list"
                      cdkDropList
                      #doneList="cdkDropList"
                      [cdkDropListConnectedTo]="[todoList]"
                      class="drop-list done-list"
                      (cdkDropListDropped)="onDoneDrop($event)"
                    >
                      @for (item of doneItems(); track item) {
                        <div cdkDrag class="drag-item done-item">{{ item }}</div>
                      }
                      @if (doneItems().length === 0) {
                        <p class="empty-hint">Drop items here</p>
                      }
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── VIRTUAL SCROLL ── -->
        <mat-tab label="Virtual Scroll">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Virtual Scrolling</mat-card-title>
                <mat-card-subtitle>Rendering 10,000 items efficiently — only visible rows are in the DOM</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="hint">
                  <code>CdkVirtualScrollViewport</code> with <code>itemSize="48"</code> renders only
                  the visible items, keeping memory and DOM size constant regardless of list length.
                </p>
                <cdk-virtual-scroll-viewport itemSize="48" class="virtual-viewport">
                  <div *cdkVirtualFor="let item of virtualItems; let i = index" class="virtual-item">
                    <span class="virtual-index">{{ i + 1 }}</span>
                    <span>{{ item }}</span>
                  </div>
                </cdk-virtual-scroll-viewport>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── OVERLAY & CLIPBOARD ── -->
        <mat-tab label="Overlay & Clipboard">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Clipboard</mat-card-title>
                <mat-card-subtitle>Copy text to the system clipboard using the <code>Clipboard</code> service</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <pre class="code-block">{{ codeSnippet }}</pre>
                <button mat-raised-button color="primary" (click)="copyCode()">
                  <mat-icon>content_copy</mat-icon>
                  Copy Code
                </button>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Overlay</mat-card-title>
                <mat-card-subtitle>Programmatic floating panels with flexible position strategies</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="hint">
                  Uses <code>FlexibleConnectedPositionStrategy</code> to position the panel below
                  the trigger button. Click outside or scroll to close.
                </p>
                <button
                  mat-raised-button
                  color="accent"
                  #overlayOrigin
                  (click)="openOverlay()"
                >
                  <mat-icon>layers</mat-icon>
                  {{ isOverlayOpen() ? 'Close Overlay' : 'Open Overlay' }}
                </button>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── LAYOUT & A11Y ── -->
        <mat-tab label="Layout & A11y">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Breakpoint Observer</mat-card-title>
                <mat-card-subtitle>Reactively detect viewport size breakpoints with <code>BreakpointObserver</code></mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="breakpoint-display">
                  <mat-icon class="bp-icon">devices</mat-icon>
                  <div>
                    <p class="bp-label">Current Breakpoint</p>
                    <p class="bp-value">{{ currentBreakpoint() }}</p>
                  </div>
                </div>
                <p class="hint">Resize the browser window to see the breakpoint update reactively.</p>

                <mat-divider style="margin: 16px 0" />

                <div class="breakpoint-grid">
                  <div class="bp-row">
                    <code>XSmall</code><span>&lt; 600px</span>
                  </div>
                  <div class="bp-row">
                    <code>Small</code><span>600 – 959px</span>
                  </div>
                  <div class="bp-row">
                    <code>Medium</code><span>960 – 1279px</span>
                  </div>
                  <div class="bp-row">
                    <code>Large</code><span>1280 – 1919px</span>
                  </div>
                  <div class="bp-row">
                    <code>XLarge</code><span>≥ 1920px</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Live Announcer</mat-card-title>
                <mat-card-subtitle>Send ARIA live announcements to screen readers with <code>LiveAnnouncer</code></mat-card-subtitle>
              </mat-card-header>
              <mat-card-content class="col-stack">
                <mat-form-field appearance="outline">
                  <mat-label>Message to announce</mat-label>
                  <input
                    matInput
                    [(ngModel)]="announceInput"
                    placeholder="Type a message…"
                    (keyup.enter)="announce()"
                  />
                </mat-form-field>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="announce()"
                  [disabled]="!announceInput.trim()"
                >
                  <mat-icon>record_voice_over</mat-icon>
                  Announce to Screen Reader
                </button>
                @if (lastAnnounced()) {
                  <div class="announce-result">
                    <mat-icon>check_circle</mat-icon>
                    Announced: <em>"{{ lastAnnounced() }}"</em>
                  </div>
                }
                <p class="hint">
                  Screen readers will read the message aloud. Open your browser's accessibility tree
                  or enable a screen reader to observe the live region update.
                </p>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── TEXT FIELD & STEPPER ── -->
        <mat-tab label="Text Field & Stepper">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Autosize Textarea</mat-card-title>
                <mat-card-subtitle>
                  <code>cdkTextareaAutosize</code> — grows and shrinks as content changes
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <mat-form-field appearance="outline" style="width: 100%;">
                  <mat-label>Auto-resize textarea</mat-label>
                  <textarea
                    matInput
                    cdkTextareaAutosize
                    cdkAutosizeMinRows="3"
                    cdkAutosizeMaxRows="12"
                    [(ngModel)]="autosizeValue"
                    placeholder="Start typing… the textarea grows automatically up to 12 rows, then scrolls."
                  ></textarea>
                </mat-form-field>
                @if (autosizeValue) {
                  <p class="hint">Characters: {{ autosizeValue.length }}</p>
                }
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Custom CDK Stepper</mat-card-title>
                <mat-card-subtitle>
                  Build a fully custom stepper UI by extending <code>CdkStepper</code>
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <app-cdk-stepper>
                  <cdk-step label="Account">
                    <div class="step-content">
                      <h4>Create Account</h4>
                      <p>Set up your account credentials.</p>
                      <mat-form-field appearance="outline" style="width: 100%;">
                        <mat-label>Username</mat-label>
                        <input matInput placeholder="your-username" />
                        <mat-icon matPrefix>person</mat-icon>
                      </mat-form-field>
                    </div>
                  </cdk-step>

                  <cdk-step label="Profile">
                    <div class="step-content">
                      <h4>Profile Details</h4>
                      <p>Tell us a bit about yourself.</p>
                      <mat-form-field appearance="outline" style="width: 100%;">
                        <mat-label>Full Name</mat-label>
                        <input matInput placeholder="Jane Doe" />
                        <mat-icon matPrefix>badge</mat-icon>
                      </mat-form-field>
                    </div>
                  </cdk-step>

                  <cdk-step label="Confirm">
                    <div class="step-content confirm-step">
                      <div class="confirm-emoji">🎉</div>
                      <h4>All Done!</h4>
                      <p>Your custom CDK stepper is working. No Material Stepper needed.</p>
                    </div>
                  </cdk-step>
                </app-cdk-stepper>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

      </mat-tab-group>
    </div>

    <!-- Overlay panel template -->
    <ng-template #overlayTpl>
      <div class="overlay-panel">
        <div class="overlay-panel-header">
          <strong>CDK Overlay Panel</strong>
          <button mat-icon-button (click)="closeOverlay()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <mat-divider />
        <div class="overlay-panel-body">
          <p>Rendered using <code>CDK Overlay</code> with:</p>
          <ul>
            <li><code>FlexibleConnectedPositionStrategy</code></li>
            <li>Transparent backdrop (click to close)</li>
            <li>Scroll strategy: <code>close</code></li>
            <li>Positioned below the origin element</li>
          </ul>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }

    .demo-toolbar {
      gap: 4px;
    }

    .page-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .tab-body {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    mat-card {
      border-radius: 10px !important;
    }

    mat-card-content {
      padding-top: 12px !important;
    }

    code {
      background: #edf6e5;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.85em;
      color: #1e5c4c;
    }

    .hint {
      font-size: 0.875rem;
      color: #666;
      margin: 8px 0;
    }

    .col-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Drag & Drop ─────────────────────────────────────── */
    .drop-list {
      min-height: 60px;
      border: 2px dashed #d4e6c5;
      border-radius: 8px;
      padding: 8px;
      transition: background 0.2s;
    }

    .drop-list.cdk-drop-list-dragging { background: #f0f9eb; }
    .drop-list.cdk-drop-list-receiving { background: #e8f5e9; border-color: #1e5c4c; }

    .drag-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      margin-bottom: 6px;
      background: white;
      border: 1px solid #d4e6c5;
      border-radius: 6px;
      cursor: grab;
      transition: box-shadow 0.15s, transform 0.15s;
      font-size: 0.9rem;
    }

    .drag-item:last-child { margin-bottom: 0; }
    .drag-item:active { cursor: grabbing; }
    .drag-item.cdk-drag-preview {
      box-shadow: 0 6px 20px rgba(0,0,0,0.18);
      border-radius: 6px;
    }
    .drag-item.cdk-drag-animating { transition: transform 250ms cubic-bezier(0,0,0.2,1); }
    .drag-placeholder { background: #e8f5e9; border: 2px dashed #1e5c4c; border-radius: 6px; min-height: 42px; }
    .drag-handle { cursor: grab; color: #aaa; font-size: 20px; }
    .done-item { background: #f0faf0; color: #444; text-decoration: line-through; }

    .transfer-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .transfer-list-wrap .list-label {
      font-weight: 700;
      margin: 0 0 8px;
      font-size: 0.9rem;
    }

    .todo-list { border-color: #f0c060; }
    .done-list { border-color: #60c090; }

    .empty-hint {
      text-align: center;
      color: #bbb;
      padding: 20px;
      margin: 0;
      font-size: 0.85rem;
    }

    /* ── Virtual Scroll ──────────────────────────────────── */
    .virtual-viewport {
      height: 400px;
      border: 1px solid #d4e6c5;
      border-radius: 8px;
      overflow-y: auto;
    }

    .virtual-item {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      border-bottom: 1px solid #f0f4ec;
      font-size: 0.875rem;
    }

    .virtual-item:nth-child(even) { background: #fafdf7; }

    .virtual-index {
      min-width: 52px;
      font-weight: 700;
      color: #1e5c4c;
      font-size: 0.8rem;
    }

    /* ── Clipboard ───────────────────────────────────────── */
    .code-block {
      background: #1e2a24;
      color: #a8d8b0;
      padding: 16px;
      border-radius: 8px;
      font-size: 0.8rem;
      line-height: 1.6;
      overflow-x: auto;
      margin-bottom: 12px;
    }

    /* ── Overlay panel ───────────────────────────────────── */
    .overlay-panel {
      background: white;
      border: 1px solid #d4e6c5;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.16);
      min-width: 280px;
      overflow: hidden;
    }

    .overlay-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background: #edf6e5;
    }

    .overlay-panel-body {
      padding: 16px;
      font-size: 0.875rem;
    }

    .overlay-panel-body ul {
      margin: 8px 0 0;
      padding-left: 20px;
      line-height: 2;
    }

    /* ── Breakpoint ──────────────────────────────────────── */
    .breakpoint-display {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #edf6e5;
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .bp-icon { font-size: 36px; width: 36px; height: 36px; color: #1e5c4c; }
    .bp-label { margin: 0; font-size: 0.8rem; color: #666; }
    .bp-value { margin: 2px 0 0; font-size: 1.1rem; font-weight: 700; color: #122027; }

    .breakpoint-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .bp-row {
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 0.875rem;
    }

    .bp-row code { min-width: 70px; }

    /* ── Live Announcer ──────────────────────────────────── */
    .announce-result {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #edf6e5;
      border-radius: 6px;
      color: #1e5c4c;
      font-size: 0.9rem;
    }

    /* ── Stepper step content ────────────────────────────── */
    .step-content h4 {
      margin: 0 0 4px;
      color: #122027;
    }

    .step-content p {
      margin: 0 0 16px;
      color: #555;
      font-size: 0.9rem;
    }

    .confirm-step {
      text-align: center;
    }

    .confirm-emoji {
      font-size: 3rem;
      margin-bottom: 8px;
    }
  `],
})
export class CdkExamplesComponent implements OnDestroy {
  private clipboard = inject(Clipboard);
  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private liveAnnouncer = inject(LiveAnnouncer);
  private snackBar = inject(MatSnackBar);
  private breakpointObserver = inject(BreakpointObserver);

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  sortableList = signal(['Angular CDK', 'Angular Material', 'RxJS', 'NgRx Signals', 'TypeScript']);
  todoItems = signal(['Build feature', 'Write tests', 'Fix bugs', 'Review PR']);
  doneItems = signal<string[]>([]);

  onSortDrop(event: CdkDragDrop<string[]>) {
    const list = [...this.sortableList()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.sortableList.set(list);
  }

  onTodoDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      const list = [...this.todoItems()];
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      this.todoItems.set(list);
    } else {
      const todo = [...this.todoItems()];
      const done = [...this.doneItems()];
      transferArrayItem(done, todo, event.previousIndex, event.currentIndex);
      this.todoItems.set(todo);
      this.doneItems.set(done);
    }
  }

  onDoneDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      const list = [...this.doneItems()];
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      this.doneItems.set(list);
    } else {
      const todo = [...this.todoItems()];
      const done = [...this.doneItems()];
      transferArrayItem(todo, done, event.previousIndex, event.currentIndex);
      this.todoItems.set(todo);
      this.doneItems.set(done);
    }
  }

  // ── Virtual Scroll ───────────────────────────────────────────────────────

  readonly virtualItems = Array.from(
    { length: 10_000 },
    (_, i) => `Row ${i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing elit`
  );

  // ── Clipboard ────────────────────────────────────────────────────────────

  readonly codeSnippet = `import { Clipboard } from '@angular/cdk/clipboard';
import { inject } from '@angular/core';

@Component({ ... })
export class MyComponent {
  private clipboard = inject(Clipboard);

  copyText(text: string) {
    const success = this.clipboard.copy(text);
    console.log('Copied:', success);
  }
}`;

  copyCode() {
    const copied = this.clipboard.copy(this.codeSnippet);
    if (copied) {
      this.snackBar.open('✓ Copied to clipboard!', '', { duration: 2000 });
    }
  }

  // ── Overlay ──────────────────────────────────────────────────────────────

  @ViewChild('overlayTpl') overlayTpl!: TemplateRef<void>;
  @ViewChild('overlayOrigin') overlayOriginRef!: ElementRef;

  private overlayRef: OverlayRef | null = null;
  isOverlayOpen = signal(false);

  openOverlay() {
    if (this.overlayRef?.hasAttached()) {
      this.closeOverlay();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.overlayOriginRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());
    this.overlayRef.attach(new TemplatePortal(this.overlayTpl, this.vcr));
    this.isOverlayOpen.set(true);
  }

  closeOverlay() {
    this.overlayRef?.detach();
    this.isOverlayOpen.set(false);
  }

  // ── Layout / Breakpoint ──────────────────────────────────────────────────

  readonly currentBreakpoint = toSignal(
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map(result => {
          const entries: [string, string][] = [
            [Breakpoints.XSmall, 'XSmall (< 600px)'],
            [Breakpoints.Small, 'Small (600–959px)'],
            [Breakpoints.Medium, 'Medium (960–1279px)'],
            [Breakpoints.Large, 'Large (1280–1919px)'],
            [Breakpoints.XLarge, 'XLarge (≥ 1920px)'],
          ];
          return entries.find(([bp]) => result.breakpoints[bp])?.[1] ?? 'Unknown';
        })
      ),
    { initialValue: 'Detecting…' }
  );

  // ── A11y / LiveAnnouncer ──────────────────────────────────────────────────

  announceInput = '';
  lastAnnounced = signal('');

  announce() {
    if (!this.announceInput.trim()) return;
    this.liveAnnouncer.announce(this.announceInput, 'assertive');
    this.lastAnnounced.set(this.announceInput);
    this.announceInput = '';
  }

  // ── Autosize Textarea ────────────────────────────────────────────────────

  autosizeValue = '';

  // ── Cleanup ──────────────────────────────────────────────────────────────

  ngOnDestroy() {
    this.overlayRef?.dispose();
  }
}
