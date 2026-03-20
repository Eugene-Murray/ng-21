import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

// Material Form Controls
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Material Navigation
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';

// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

// Material Data Display
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTreeModule } from '@angular/material/tree';

// Material Popups
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheetModule, MatBottomSheet } from '@angular/material/bottom-sheet';

interface TableRow {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: TableRow[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.011, symbol: 'C' },
];

@Component({
  selector: 'app-material-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatBadgeModule,
    MatProgressBarModule, MatProgressSpinnerModule,
    MatChipsModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, MatRadioModule, MatSlideToggleModule,
    MatSliderModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule,
    MatTabsModule, MatToolbarModule, MatMenuModule,
    MatSidenavModule, MatListModule, MatStepperModule,
    MatCardModule, MatDividerModule, MatGridListModule,
    MatExpansionModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatTreeModule,
    MatDialogModule, MatSnackBarModule, MatBottomSheetModule,
  ],
  template: `
    <!-- Toolbar demo -->
    <mat-toolbar color="primary" class="demo-toolbar">
      <mat-icon>science</mat-icon>
      <span style="margin-left: 8px;">Angular Material 21 Examples</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Options">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>Settings
        </button>
        <button mat-menu-item>
          <mat-icon>help_outline</mat-icon>Help
        </button>
      </mat-menu>
    </mat-toolbar>

    <div class="page-content">
      <mat-tab-group animationDuration="300ms" dynamicHeight>

        <!-- ── BUTTONS & INDICATORS ── -->
        <mat-tab label="Buttons & Indicators">
          <div class="tab-body">

            <mat-card>
              <mat-card-header>
                <mat-card-title>Buttons</mat-card-title>
              </mat-card-header>
              <mat-card-content class="row-wrap">
                <button mat-button>Basic</button>
                <button mat-button color="primary">Primary</button>
                <button mat-button color="accent">Accent</button>
                <button mat-button color="warn">Warn</button>
                <button mat-raised-button color="primary">Raised</button>
                <button mat-stroked-button color="primary">Stroked</button>
                <button mat-flat-button color="accent">Flat</button>
                <button mat-icon-button color="primary" matTooltip="Icon button">
                  <mat-icon>favorite</mat-icon>
                </button>
                <button mat-fab color="primary" matTooltip="FAB">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-mini-fab color="accent" matTooltip="Mini FAB">
                  <mat-icon>edit</mat-icon>
                </button>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Badge &amp; Tooltip</mat-card-title>
              </mat-card-header>
              <mat-card-content class="row-wrap">
                <button mat-button [matBadge]="badgeCount()" matBadgeColor="warn">
                  Messages
                </button>
                <button mat-raised-button color="primary" (click)="badgeCount.update(n => n + 1)">
                  +1 Badge
                </button>
                <mat-icon matTooltip="Hovering shows this tooltip" matTooltipPosition="above">
                  info
                </mat-icon>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Chips</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <mat-chip-set>
                  @for (chip of chips(); track chip) {
                    <mat-chip (removed)="removeChip(chip)" [removable]="true">
                      {{ chip }}
                      <mat-icon matChipRemove>cancel</mat-icon>
                    </mat-chip>
                  }
                </mat-chip-set>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Progress</mat-card-title>
              </mat-card-header>
              <mat-card-content class="col-stack">
                <p>Determinate bar: {{ progress() }}%</p>
                <mat-progress-bar mode="determinate" [value]="progress()"></mat-progress-bar>
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
                <mat-progress-bar mode="buffer" [value]="progress()" [bufferValue]="progress() + 15"></mat-progress-bar>
                <div class="row-wrap" style="gap: 16px; align-items: center;">
                  <mat-progress-spinner mode="determinate" [value]="progress()" diameter="50"></mat-progress-spinner>
                  <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
                </div>
                <button mat-stroked-button (click)="progress.update(v => Math.min(v + 10, 100))">
                  +10%
                </button>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── FORM CONTROLS ── -->
        <mat-tab label="Form Controls">
          <div class="tab-body">

            <mat-card>
              <mat-card-header><mat-card-title>Text Inputs</mat-card-title></mat-card-header>
              <mat-card-content class="col-stack">
                <mat-form-field appearance="outline">
                  <mat-label>Outline input</mat-label>
                  <input matInput placeholder="Type something…" />
                  <mat-icon matPrefix>search</mat-icon>
                </mat-form-field>
                <mat-form-field appearance="fill">
                  <mat-label>Fill input</mat-label>
                  <input matInput />
                  <mat-hint>Helper text goes here</mat-hint>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="showPwd() ? 'text' : 'password'" />
                  <button mat-icon-button matSuffix (click)="showPwd.update(v => !v)">
                    <mat-icon>{{ showPwd() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Textarea</mat-label>
                  <textarea matInput rows="3" placeholder="Multi-line…"></textarea>
                </mat-form-field>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Select &amp; Autocomplete</mat-card-title></mat-card-header>
              <mat-card-content class="col-stack">
                <mat-form-field appearance="outline">
                  <mat-label>Favourite food</mat-label>
                  <mat-select>
                    @for (food of foods; track food) {
                      <mat-option [value]="food">{{ food }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Autocomplete</mat-label>
                  <input matInput [matAutocomplete]="auto" [(ngModel)]="autoValue" />
                  <mat-autocomplete #auto="matAutocomplete">
                    @for (opt of filteredOptions(); track opt) {
                      <mat-option [value]="opt">{{ opt }}</mat-option>
                    }
                  </mat-autocomplete>
                </mat-form-field>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Checkboxes, Radio &amp; Toggles</mat-card-title></mat-card-header>
              <mat-card-content class="col-stack">
                <mat-checkbox [(ngModel)]="checked">Checkbox (checked: {{ checked }})</mat-checkbox>
                <mat-radio-group [(ngModel)]="radioVal" class="col-stack">
                  <mat-radio-button value="a">Option A</mat-radio-button>
                  <mat-radio-button value="b">Option B</mat-radio-button>
                  <mat-radio-button value="c">Option C</mat-radio-button>
                </mat-radio-group>
                <mat-slide-toggle [(ngModel)]="toggleOn">
                  Toggle ({{ toggleOn ? 'ON' : 'OFF' }})
                </mat-slide-toggle>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Slider &amp; Datepicker</mat-card-title></mat-card-header>
              <mat-card-content class="col-stack">
                <p>Slider value: {{ sliderVal() }}</p>
                <mat-slider min="0" max="100" step="5">
                  <input matSliderThumb [(ngModel)]="sliderNgModel" />
                </mat-slider>
                <mat-form-field appearance="outline">
                  <mat-label>Pick a date</mat-label>
                  <input matInput [matDatepicker]="picker" />
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Reactive Form with Validation</mat-card-title></mat-card-header>
              <mat-card-content>
                <form [formGroup]="profileForm" (ngSubmit)="submitForm()" class="col-stack">
                  <mat-form-field appearance="outline">
                    <mat-label>Name</mat-label>
                    <input matInput formControlName="name" />
                    @if (profileForm.controls.name.invalid && profileForm.controls.name.touched) {
                      <mat-error>Name is required</mat-error>
                    }
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" />
                    @if (profileForm.controls.email.hasError('required') && profileForm.controls.email.touched) {
                      <mat-error>Email is required</mat-error>
                    }
                    @if (profileForm.controls.email.hasError('email') && profileForm.controls.email.touched) {
                      <mat-error>Please enter a valid email</mat-error>
                    }
                  </mat-form-field>
                  <button mat-raised-button color="primary" type="submit"
                    [disabled]="profileForm.invalid">
                    Submit
                  </button>
                </form>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── NAVIGATION ── -->
        <mat-tab label="Navigation">
          <div class="tab-body">

            <mat-card>
              <mat-card-header><mat-card-title>Stepper</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-stepper [linear]="false" #stepper>
                  <mat-step label="Step 1 – Personal">
                    <p>Fill in personal details.</p>
                    <div>
                      <button mat-button matStepperNext>Next</button>
                    </div>
                  </mat-step>
                  <mat-step label="Step 2 – Address">
                    <p>Provide address information.</p>
                    <div>
                      <button mat-button matStepperPrevious>Back</button>
                      <button mat-button matStepperNext>Next</button>
                    </div>
                  </mat-step>
                  <mat-step label="Step 3 – Review">
                    <p>Review and confirm your data.</p>
                    <div>
                      <button mat-button matStepperPrevious>Back</button>
                      <button mat-raised-button color="primary" (click)="stepper.reset()">
                        Reset
                      </button>
                    </div>
                  </mat-step>
                </mat-stepper>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Sidenav</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-sidenav-container class="sidenav-container">
                  <mat-sidenav #sidenav mode="over" position="start">
                    <mat-nav-list>
                      <a mat-list-item>Dashboard</a>
                      <a mat-list-item>Profile</a>
                      <a mat-list-item>Settings</a>
                    </mat-nav-list>
                  </mat-sidenav>
                  <mat-sidenav-content>
                    <button mat-raised-button (click)="sidenav.toggle()">
                      Toggle sidenav
                    </button>
                    <p style="padding: 8px 0;">Main content area</p>
                  </mat-sidenav-content>
                </mat-sidenav-container>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>List</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-list>
                  @for (item of listItems; track item.title) {
                    <mat-list-item>
                      <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                      <div matListItemTitle>{{ item.title }}</div>
                      <div matListItemLine>{{ item.subtitle }}</div>
                    </mat-list-item>
                    <mat-divider></mat-divider>
                  }
                </mat-list>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── LAYOUT ── -->
        <mat-tab label="Layout">
          <div class="tab-body">

            <mat-card>
              <mat-card-header><mat-card-title>Cards</mat-card-title></mat-card-header>
              <mat-card-content class="row-wrap">
                <mat-card class="demo-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>account_circle</mat-icon>
                    <mat-card-title>John Doe</mat-card-title>
                    <mat-card-subtitle>Software Engineer</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content><p>Basic card with header and actions.</p></mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="primary">LIKE</button>
                    <button mat-button>SHARE</button>
                  </mat-card-actions>
                </mat-card>
                <mat-card class="demo-card" appearance="outlined">
                  <mat-card-header>
                    <mat-card-title>Outlined Card</mat-card-title>
                  </mat-card-header>
                  <mat-card-content><p>A card with outlined appearance.</p></mat-card-content>
                </mat-card>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Expansion Panel</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-accordion>
                  @for (panel of panels; track panel.title) {
                    <mat-expansion-panel>
                      <mat-expansion-panel-header>
                        <mat-panel-title>{{ panel.title }}</mat-panel-title>
                        <mat-panel-description>{{ panel.description }}</mat-panel-description>
                      </mat-expansion-panel-header>
                      <p>{{ panel.content }}</p>
                    </mat-expansion-panel>
                  }
                </mat-accordion>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Grid List</mat-card-title></mat-card-header>
              <mat-card-content>
                <mat-grid-list cols="4" rowHeight="60px" gutterSize="8px">
                  @for (tile of gridTiles; track tile.text) {
                    <mat-grid-tile [colspan]="tile.cols" [rowspan]="tile.rows"
                      [style.background]="tile.color">
                      {{ tile.text }}
                    </mat-grid-tile>
                  }
                </mat-grid-list>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Divider</mat-card-title></mat-card-header>
              <mat-card-content class="col-stack">
                <p>Above divider</p>
                <mat-divider></mat-divider>
                <p>Below horizontal divider</p>
                <div class="row-wrap" style="height: 50px; align-items: stretch;">
                  <span>Left</span>
                  <mat-divider [vertical]="true" style="margin: 0 12px;"></mat-divider>
                  <span>Right</span>
                </div>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── DATA TABLE ── -->
        <mat-tab label="Data Table">
          <div class="tab-body">

            <mat-card>
              <mat-card-header><mat-card-title>Sortable Table with Pagination</mat-card-title></mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="tableData" matSort class="full-width">
                  <ng-container matColumnDef="position">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
                    <td mat-cell *matCellDef="let e">{{ e.position }}</td>
                  </ng-container>
                  <ng-container matColumnDef="name">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                    <td mat-cell *matCellDef="let e">{{ e.name }}</td>
                  </ng-container>
                  <ng-container matColumnDef="weight">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Weight</th>
                    <td mat-cell *matCellDef="let e">{{ e.weight }}</td>
                  </ng-container>
                  <ng-container matColumnDef="symbol">
                    <th mat-header-cell *matHeaderCellDef mat-sort-header>Symbol</th>
                    <td mat-cell *matCellDef="let e">{{ e.symbol }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>
                <mat-paginator [pageSizeOptions]="[3, 6]" showFirstLastButtons></mat-paginator>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

        <!-- ── POPUPS ── -->
        <mat-tab label="Popups">
          <div class="tab-body">

            <mat-card>
              <mat-card-header><mat-card-title>Snackbar</mat-card-title></mat-card-header>
              <mat-card-content class="row-wrap">
                <button mat-raised-button color="primary" (click)="openSnack('info')">Info Snack</button>
                <button mat-raised-button color="accent" (click)="openSnack('action')">Snack with Action</button>
                <button mat-raised-button color="warn" (click)="openSnack('warn')">Warning Snack</button>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Dialog</mat-card-title></mat-card-header>
              <mat-card-content>
                <button mat-raised-button color="primary" (click)="openDialog()">
                  Open Dialog
                </button>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header><mat-card-title>Bottom Sheet</mat-card-title></mat-card-header>
              <mat-card-content>
                <button mat-raised-button (click)="openBottomSheet()">
                  Open Bottom Sheet
                </button>
              </mat-card-content>
            </mat-card>

          </div>
        </mat-tab>

      </mat-tab-group>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .demo-toolbar { position: sticky; top: 0; z-index: 10; }
    .spacer { flex: 1 1 auto; }

    .page-content { padding: 16px; }

    .tab-body {
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .row-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .col-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    mat-card-content { padding-top: 8px !important; }

    .demo-card { width: 220px; }

    .sidenav-container {
      height: 160px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }

    .full-width { width: 100%; }

    table { margin-bottom: 0; }
  `]
})
export class MaterialExamplesComponent {
  // Injected services
  readonly #snackBar = inject(MatSnackBar);
  readonly #dialog = inject(MatDialog);
  readonly #bottomSheet = inject(MatBottomSheet);
  readonly #fb = inject(FormBuilder);

  // Badge
  badgeCount = signal(3);

  // Chips
  chips = signal(['Angular', 'Material', 'Signals', 'CDK']);
  removeChip(chip: string) {
    this.chips.update(list => list.filter(c => c !== chip));
  }

  // Progress
  progress = signal(40);
  readonly Math = Math;

  // Inputs
  showPwd = signal(false);

  // Select
  foods = ['Pizza', 'Burger', 'Tacos', 'Sushi', 'Pasta'];

  // Autocomplete
  autoValue = '';
  private allOptions = ['Angular', 'React', 'Vue', 'Svelte', 'Solid'];
  filteredOptions = signal(this.allOptions);

  // Checkbox / Radio / Toggle
  checked = true;
  radioVal = 'a';
  toggleOn = true;

  // Slider
  sliderNgModel = 30;
  sliderVal = signal(30);

  // Reactive form
  profileForm = this.#fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  submitForm() {
    if (this.profileForm.valid) {
      this.#snackBar.open(`Submitted: ${this.profileForm.value.name}`, 'Close', { duration: 3000 });
    }
  }

  // List items
  listItems = [
    { icon: 'inbox', title: 'Inbox', subtitle: '12 unread messages' },
    { icon: 'send', title: 'Sent', subtitle: 'Last sent 2 hours ago' },
    { icon: 'drafts', title: 'Drafts', subtitle: '3 drafts pending' },
    { icon: 'delete', title: 'Trash', subtitle: 'Empty' },
  ];

  // Expansion panels
  panels = [
    { title: 'General Settings', description: 'Account & preferences', content: 'Manage your account details and notification preferences here.' },
    { title: 'Privacy', description: 'Visibility settings', content: 'Control who can see your profile and activities.' },
    { title: 'Notifications', description: 'Email & push', content: 'Configure how and when you receive notifications.' },
  ];

  // Grid tiles
  gridTiles = [
    { text: 'One', cols: 2, rows: 1, color: '#a8d8ea' },
    { text: 'Two', cols: 1, rows: 2, color: '#aa96da' },
    { text: 'Three', cols: 1, rows: 1, color: '#fcbad3' },
    { text: 'Four', cols: 2, rows: 1, color: '#ffffd2' },
  ];

  // Table
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  tableData = ELEMENT_DATA;

  // Snackbar
  openSnack(type: 'info' | 'action' | 'warn') {
    if (type === 'action') {
      const ref = this.#snackBar.open('File saved successfully!', 'UNDO', { duration: 4000 });
      ref.onAction().subscribe(() => this.#snackBar.open('Action undone', undefined, { duration: 2000 }));
    } else if (type === 'warn') {
      this.#snackBar.open('Something went wrong!', 'Dismiss', {
        duration: 4000,
        panelClass: ['warn-snack'],
      });
    } else {
      this.#snackBar.open('This is an informational snackbar', undefined, { duration: 3000 });
    }
  }

  // Dialog (inline component)
  openDialog() {
    this.#dialog.open(SimpleDialogComponent);
  }

  // Bottom Sheet (inline component)
  openBottomSheet() {
    this.#bottomSheet.open(SimpleBottomSheetComponent);
  }
}

// ── Inline Dialog ──────────────────────────────────────────────────────────

import { inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Action</h2>
    <mat-dialog-content>
      <p>Are you sure you want to proceed with this action?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="ref.close(true)">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class SimpleDialogComponent {
  readonly ref = inject(MatDialogRef<SimpleDialogComponent>);
}

// ── Inline Bottom Sheet ────────────────────────────────────────────────────

import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-simple-bottom-sheet',
  imports: [MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item (click)="dismiss()">
        <mat-icon matListItemIcon>cloud_upload</mat-icon>
        <span matListItemTitle>Upload</span>
      </a>
      <a mat-list-item (click)="dismiss()">
        <mat-icon matListItemIcon>share</mat-icon>
        <span matListItemTitle>Share</span>
      </a>
      <a mat-list-item (click)="dismiss()">
        <mat-icon matListItemIcon>delete</mat-icon>
        <span matListItemTitle>Delete</span>
      </a>
    </mat-nav-list>
  `,
})
export class SimpleBottomSheetComponent {
  readonly #ref = inject(MatBottomSheetRef<SimpleBottomSheetComponent>);
  dismiss() { this.#ref.dismiss(); }
}
