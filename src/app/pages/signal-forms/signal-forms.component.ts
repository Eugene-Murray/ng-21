import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type FormControl,
  type FormGroup
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

interface SignupFormValue {
  readonly fullName: string;
  readonly email: string;
  readonly role: string;
}

type SignupForm = FormGroup<{
  fullName: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<string>;
}>;

@Component({
  selector: 'app-signal-forms',
  imports: [JsonPipe, ReactiveFormsModule, RouterLink],
  template: `
    <main class="signal-forms-page">
      <header>
        <p class="eyebrow">Forms + Signals</p>
        <h1>Signal Forms Demo</h1>
        <p>
          This example uses Reactive Forms and converts form streams to signals with
          <strong>toSignal()</strong>, then derives UI state with <strong>computed()</strong>.
        </p>
      </header>

      <section class="card" aria-labelledby="signup-form-title">
        <h2 id="signup-form-title">Signup Form</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label for="fullName">Full name</label>
          <input id="fullName" type="text" formControlName="fullName" />
          @if (nameError()) {
            <p class="error">{{ nameError() }}</p>
          }

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          @if (emailError()) {
            <p class="error">{{ emailError() }}</p>
          }

          <label for="role">Role</label>
          <select id="role" formControlName="role">
            <option value="">Choose a role</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="platform">Platform</option>
          </select>
          @if (roleError()) {
            <p class="error">{{ roleError() }}</p>
          }

          <button type="submit" [disabled]="isSubmitDisabled()">Create account</button>
        </form>
      </section>

      <section class="card" aria-label="Signal view model preview">
        <h2>Signal View Model</h2>
        <p>Status: <strong>{{ formStatus() }}</strong></p>
        <p>Summary: {{ formSummary() }}</p>
      </section>

      @if (submitted()) {
        <section class="card success" aria-live="polite">
          <h2>Submitted payload</h2>
          <pre>{{ submitted() | json }}</pre>
        </section>
      }

      <a class="back-link" routerLink="/feature-lab">Back to Feature Lab</a>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .signal-forms-page {
        min-height: 100%;
        padding: 1.5rem;
        color: #1a1f2d;
        background:
          radial-gradient(circle at 10% 15%, #ffe6c7 0%, rgba(255, 230, 199, 0) 36%),
          radial-gradient(circle at 90% 20%, #d3f2ff 0%, rgba(211, 242, 255, 0) 36%),
          linear-gradient(145deg, #f9fbff 0%, #f4fcff 100%);
      }

      .eyebrow {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #485c92;
        font-weight: 700;
      }

      h1 {
        margin: 0.35rem 0 0.5rem;
        font-size: clamp(1.5rem, 3vw, 2.1rem);
      }

      .card {
        margin-top: 1rem;
        padding: 1rem;
        border: 1px solid #cdd6eb;
        border-radius: 0.8rem;
        background: rgba(255, 255, 255, 0.84);
      }

      .success {
        border-color: #9dc7b3;
      }

      form {
        display: grid;
        gap: 0.35rem;
      }

      label {
        margin-top: 0.4rem;
        font-weight: 600;
      }

      input,
      select,
      button {
        font: inherit;
      }

      input,
      select {
        width: min(28rem, 100%);
        border: 1px solid #aeb8d3;
        border-radius: 0.5rem;
        padding: 0.5rem 0.55rem;
        background: #ffffff;
      }

      button {
        margin-top: 0.75rem;
        width: fit-content;
        border: 1px solid #385ea3;
        border-radius: 0.55rem;
        padding: 0.5rem 0.8rem;
        color: #ffffff;
        background: #385ea3;
        font-weight: 700;
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error {
        margin: 0;
        color: #b4233c;
      }

      pre {
        margin: 0;
        overflow: auto;
      }

      .back-link {
        display: inline-block;
        margin-top: 1rem;
        color: #215f9f;
        font-weight: 600;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalFormsComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly form: SignupForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });

  readonly formValue = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    {
    initialValue: this.form.getRawValue()
    }
  );

  readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status
  });

  readonly submitted = computed<SignupFormValue | null>(() => {
    const value = this.formValue();
    if (!this.form.valid || !this.form.touched) {
      return null;
    }

    return {
      fullName: value.fullName,
      email: value.email,
      role: value.role
    };
  });

  readonly formSummary = computed(() => {
    const value = this.formValue();
    const role = value.role || 'no role selected';
    return `${value.fullName || 'Anonymous'} (${value.email || 'missing email'}) - ${role}`;
  });

  readonly isSubmitDisabled = computed(() => this.formStatus() !== 'VALID');

  readonly nameError = computed(() => this.getControlError('fullName'));
  readonly emailError = computed(() => this.getControlError('email'));
  readonly roleError = computed(() => this.getControlError('role'));

  submit(): void {
    this.form.markAllAsTouched();
  }

  private getControlError(controlName: keyof SignupFormValue): string {
    const control = this.form.controls[controlName];
    if (!control.touched || control.valid) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (controlName === 'fullName' && control.hasError('minlength')) {
      return 'Please enter at least 3 characters.';
    }

    if (controlName === 'email' && control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    return 'Invalid value.';
  }
}