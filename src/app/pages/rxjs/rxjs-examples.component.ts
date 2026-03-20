import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  finalize,
  forkJoin,
  from,
  interval,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  range,
  ReplaySubject,
  retry,
  scan,
  shareReplay,
  skip,
  startWith,
  Subject,
  switchMap,
  take,
  takeWhile,
  tap,
  throttleTime,
  timer,
  withLatestFrom,
  zip,
} from 'rxjs';

type Category =
  | 'creation'
  | 'transformation'
  | 'filtering'
  | 'combination'
  | 'error'
  | 'multicasting'
  | 'utility';

interface CategoryMeta {
  readonly id: Category;
  readonly label: string;
}

const CATEGORIES: CategoryMeta[] = [
  { id: 'creation', label: 'Creation' },
  { id: 'transformation', label: 'Transformation' },
  { id: 'filtering', label: 'Filtering' },
  { id: 'combination', label: 'Combination' },
  { id: 'error', label: 'Error Handling' },
  { id: 'multicasting', label: 'Multicasting' },
  { id: 'utility', label: 'Utility' },
];

@Component({
  selector: 'app-rxjs-examples',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <a routerLink="/" class="back-link">← Back to lab</a>

      <header class="hero">
        <h1>RxJS Examples</h1>
        <p>
          Interactive playground covering 35+ operators across 7 categories.
          Inspired by <strong>learnrxjs.io</strong> — click <strong>Run</strong> or interact with
          each demo to see live output.
        </p>
      </header>

      <nav class="categories" aria-label="Operator categories">
        @for (cat of categories; track cat.id) {
          <button
            type="button"
            class="cat-btn"
            [class.active]="activeCategory() === cat.id"
            (click)="activeCategory.set(cat.id)"
          >
            {{ cat.label }}
          </button>
        }
      </nav>

      <!-- ░░░ CREATION ░░░ -->
      @switch (activeCategory()) {
        @case ('creation') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>of()</h3>
              <p class="desc">Emit a fixed sequence of values synchronously, then complete.</p>
              <pre class="code">of(1, 'hello', true, null)
  .subscribe(v => console.log(v))
// 1  'hello'  true  null</pre>
              <button type="button" class="run-btn" (click)="runOf()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="ofOut.set([])">clear</button>
                @for (line of ofOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!ofOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>from()</h3>
              <p class="desc">Convert an array, iterable, or Promise into an Observable.</p>
              <pre class="code">from([10, 20, 30, 40])
  .subscribe(v => console.log(v))
// 10  20  30  40</pre>
              <button type="button" class="run-btn" (click)="runFrom()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="fromOut.set([])">clear</button>
                @for (line of fromOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!fromOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>from(Promise)</h3>
              <p class="desc">Wrap a Promise as an Observable — resolves once, then completes.</p>
              <pre class="code">from(Promise.resolve(&#123; user: 'Alice', role: 'admin' &#125;))
  .subscribe(v => console.log(v))</pre>
              <button type="button" class="run-btn" (click)="runFromPromise()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="fromPromiseOut.set([])">clear</button>
                @for (line of fromPromiseOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!fromPromiseOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>interval()</h3>
              <p class="desc">Emit an incrementing integer at each interval tick. Infinite unless limited.</p>
              <pre class="code">interval(400).pipe(take(5))
  .subscribe(v => console.log(v))
// 0  1  2  3  4</pre>
              <button type="button" class="run-btn" (click)="runInterval()">Run (5 values)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="intervalOut.set([])">clear</button>
                @for (line of intervalOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!intervalOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>timer()</h3>
              <p class="desc">Emit after an initial delay, then optionally at periodic intervals.</p>
              <pre class="code">timer(300, 300).pipe(take(5))
  .subscribe(v => console.log(v))
// delayed start, then 0 1 2 3 4</pre>
              <button type="button" class="run-btn" (click)="runTimer()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="timerOut.set([])">clear</button>
                @for (line of timerOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!timerOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>range()</h3>
              <p class="desc">Emit a sequential range of integers synchronously.</p>
              <pre class="code">range(1, 8)
  .subscribe(v => console.log(v))
// 1  2  3  4  5  6  7  8</pre>
              <button type="button" class="run-btn" (click)="runRange()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="rangeOut.set([])">clear</button>
                @for (line of rangeOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!rangeOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ TRANSFORMATION ░░░ -->
        @case ('transformation') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>map()</h3>
              <p class="desc">Apply a projection to each emitted value. The core transformation operator.</p>
              <pre class="code">of(1, 2, 3, 4, 5)
  .pipe(map(x => x * x))
  .subscribe(v => console.log(v))
// 1  4  9  16  25</pre>
              <button type="button" class="run-btn" (click)="runMap()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="mapOut.set([])">clear</button>
                @for (line of mapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!mapOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>switchMap()</h3>
              <p class="desc">
                Map to an inner Observable; cancel the previous inner subscription when source emits again.
                Perfect for search — every new keystroke cancels the previous request.
              </p>
              <pre class="code">trigger$.pipe(
  switchMap(() => timer(0, 300).pipe(take(4)))
)</pre>
              <button type="button" class="run-btn" (click)="triggerSwitchMap()">Trigger (cancels prev)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="switchMapOut.set([])">clear</button>
                @for (line of switchMapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!switchMapOut().length) { <span class="empty">— click Trigger multiple times quickly —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>mergeMap()</h3>
              <p class="desc">
                Map to an inner Observable and merge all active inner subscriptions concurrently.
                Order is NOT guaranteed. Ideal for parallel tasks (e.g. upload multiple files).
              </p>
              <pre class="code">trigger$.pipe(
  mergeMap(() => timer(0, 300).pipe(take(3)))
)</pre>
              <button type="button" class="run-btn" (click)="triggerMergeMap()">Trigger (parallel)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="mergeMapOut.set([])">clear</button>
                @for (line of mergeMapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!mergeMapOut().length) { <span class="empty">— click Trigger multiple times —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>concatMap()</h3>
              <p class="desc">
                Queue inner Observables and only subscribe to the next one after the current completes.
                Order is guaranteed. Use when sequence matters (e.g. sequential API calls).
              </p>
              <pre class="code">of('A', 'B', 'C').pipe(
  concatMap(s => timer(0, 200).pipe(take(2), map(i => s + i)))
)</pre>
              <button type="button" class="run-btn" (click)="runConcatMap()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="concatMapOut.set([])">clear</button>
                @for (line of concatMapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!concatMapOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>exhaustMap()</h3>
              <p class="desc">
                Map to inner Observable; ignore new source emissions until the current inner completes.
                "First wins." Great for preventing duplicate form submissions.
              </p>
              <pre class="code">trigger$.pipe(
  exhaustMap(() => timer(0, 300).pipe(take(4)))
)</pre>
              <button type="button" class="run-btn" (click)="triggerExhaustMap()">Trigger (rapid ignored)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="exhaustMapOut.set([])">clear</button>
                @for (line of exhaustMapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!exhaustMapOut().length) { <span class="empty">— click rapidly to see ignored triggers —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>scan()</h3>
              <p class="desc">
                Accumulate state over time — like <code>Array.reduce()</code> but emits
                each intermediate result. Great for running totals, counters, and state machines.
              </p>
              <pre class="code">clicks$.pipe(
  scan(acc => acc + 1, 0)
)</pre>
              <button type="button" class="run-btn" (click)="triggerScan()">Click to increment</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="scanOut.set([])">clear</button>
                @for (line of scanOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!scanOut().length) { <span class="empty">— press Click to increment —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ FILTERING ░░░ -->
        @case ('filtering') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>filter()</h3>
              <p class="desc">Only emit values that satisfy the predicate function.</p>
              <pre class="code">range(1, 10).pipe(
  filter(n => n % 2 === 0)
)
// 2  4  6  8  10</pre>
              <button type="button" class="run-btn" (click)="runFilter()">Run (even numbers)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="filterOut.set([])">clear</button>
                @for (line of filterOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!filterOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>take()</h3>
              <p class="desc">Take the first N values then complete, ignoring the rest.</p>
              <pre class="code">interval(300).pipe(take(5))
// 0  1  2  3  4  →complete</pre>
              <button type="button" class="run-btn" (click)="runTake()">Run (first 5)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="takeOut.set([])">clear</button>
                @for (line of takeOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!takeOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>skip()</h3>
              <p class="desc">Skip the first N values, then emit the rest normally.</p>
              <pre class="code">range(1, 8).pipe(skip(3))
// skips 1,2,3 → 4  5  6  7  8</pre>
              <button type="button" class="run-btn" (click)="runSkip()">Run (skip first 3)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="skipOut.set([])">clear</button>
                @for (line of skipOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!skipOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>debounceTime()</h3>
              <p class="desc">
                Only emit after N milliseconds of silence on the source. The classic operator for
                search inputs — waits until the user stops typing.
              </p>
              <pre class="code">inputEvents$.pipe(debounceTime(400))</pre>
              <input
                type="text"
                class="demo-input"
                placeholder="Type here (400ms debounce)..."
                (input)="onDebounceInput($event)"
              />
              <div class="output">
                <button class="clear-btn" type="button" (click)="debounceOut.set([])">clear</button>
                @for (line of debounceOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!debounceOut().length) { <span class="empty">— type in the input above —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>throttleTime()</h3>
              <p class="desc">
                Emit the first value then ignore subsequent values for N milliseconds.
                Good for scroll/click handlers where you want responsiveness but not flooding.
              </p>
              <pre class="code">clicks$.pipe(throttleTime(1000))</pre>
              <button type="button" class="run-btn" (click)="triggerThrottle()">Rapid click me!</button>
              <small class="hint">Click many times fast — only 1 per second passes through.</small>
              <div class="output">
                <button class="clear-btn" type="button" (click)="throttleOut.set([])">clear</button>
                @for (line of throttleOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!throttleOut().length) { <span class="empty">— click rapidly —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>distinctUntilChanged()</h3>
              <p class="desc">
                Suppress emission if the current value is identical to the previous.
                Essential for avoiding unnecessary re-renders or API calls.
              </p>
              <pre class="code">of(1, 1, 2, 2, 3, 1, 1).pipe(
  distinctUntilChanged()
)
// 1  2  3  1</pre>
              <button type="button" class="run-btn" (click)="runDistinct()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="distinctOut.set([])">clear</button>
                @for (line of distinctOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!distinctOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>takeWhile()</h3>
              <p class="desc">
                Emit values while the predicate returns true; complete when it returns false.
              </p>
              <pre class="code">interval(200).pipe(
  takeWhile(n => n &lt; 5)
)
// 0  1  2  3  4  →complete</pre>
              <button type="button" class="run-btn" (click)="runTakeWhile()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="takeWhileOut.set([])">clear</button>
                @for (line of takeWhileOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!takeWhileOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ COMBINATION ░░░ -->
        @case ('combination') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>combineLatest()</h3>
              <p class="desc">
                When any source emits, combine it with the latest value from every other source.
                All sources must have emitted at least once before any output appears.
              </p>
              <pre class="code">combineLatest([
  timer(0, 400).pipe(take(4), map(n => 'A:' + n)),
  timer(200, 600).pipe(take(3), map(n => 'B:' + n))
])</pre>
              <button type="button" class="run-btn" (click)="runCombineLatest()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="combineLatestOut.set([])">clear</button>
                @for (line of combineLatestOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!combineLatestOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>merge()</h3>
              <p class="desc">
                Subscribe to all sources simultaneously and emit values as they arrive.
                Output order reflects real-time interleaving.
              </p>
              <pre class="code">merge(
  timer(0,   500).pipe(take(3), map(n => 'A:' + n)),
  timer(250, 500).pipe(take(3), map(n => 'B:' + n))
)
// A:0  B:0  A:1  B:1  A:2  B:2</pre>
              <button type="button" class="run-btn" (click)="runMerge()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="mergeOut.set([])">clear</button>
                @for (line of mergeOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!mergeOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>concat()</h3>
              <p class="desc">
                Subscribe to each source one at a time — only moves to the next when the current
                completes. Guarantees order.
              </p>
              <pre class="code">concat(
  of('sync-A', 'sync-B'),
  timer(0, 300).pipe(take(3), map(n => 'delayed-' + n))
)</pre>
              <button type="button" class="run-btn" (click)="runConcat()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="concatOut.set([])">clear</button>
                @for (line of concatOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!concatOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>forkJoin()</h3>
              <p class="desc">
                Wait for all sources to complete, then emit their final values as an object or array.
                The Observable equivalent of Promise.all().
              </p>
              <pre class="code">forkJoin(&#123;
  user: of('Alice').pipe(delay(400)),
  posts: of(42).pipe(delay(800))
&#125;)
// &#123; user: 'Alice', posts: 42 &#125; after 800ms</pre>
              <button type="button" class="run-btn" (click)="runForkJoin()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="forkJoinOut.set([])">clear</button>
                @for (line of forkJoinOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!forkJoinOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>zip()</h3>
              <p class="desc">
                Pair values from multiple sources by index — waits for each source to emit a matching
                value at the same position.
              </p>
              <pre class="code">zip(of('A', 'B', 'C'), of(1, 2, 3))
// ['A', 1]  ['B', 2]  ['C', 3]</pre>
              <button type="button" class="run-btn" (click)="runZip()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="zipOut.set([])">clear</button>
                @for (line of zipOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!zipOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>startWith()</h3>
              <p class="desc">
                Prepend a synchronous value before the first emission of the source.
                Useful for providing an initial "loading" or default state.
              </p>
              <pre class="code">interval(400).pipe(
  take(4),
  startWith(-1)
)
// -1 (immediate)  0  1  2  3</pre>
              <button type="button" class="run-btn" (click)="runStartWith()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="startWithOut.set([])">clear</button>
                @for (line of startWithOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!startWithOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>withLatestFrom()</h3>
              <p class="desc">
                When the source emits, sample the most recent value from a second Observable.
                The second Observable is subscribed immediately but only sampled on source emission.
              </p>
              <pre class="code">// timer runs in background (counts up)
clicks$.pipe(
  withLatestFrom(timer(0, 500))
)
// [click, latestTimerValue]</pre>
              <button type="button" class="run-btn" (click)="triggerWithLatestFrom()">Sample latest timer</button>
              <small class="hint">Each click samples the background timer's current value.</small>
              <div class="output">
                <button class="clear-btn" type="button" (click)="withLatestFromOut.set([])">clear</button>
                @for (line of withLatestFromOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!withLatestFromOut().length) { <span class="empty">— press Sample —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ ERROR HANDLING ░░░ -->
        @case ('error') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>catchError()</h3>
              <p class="desc">
                Intercept an error and return a replacement Observable. The stream can recover and
                continue rather than terminating with an unhandled error.
              </p>
              <pre class="code">of(1, 2, 3).pipe(
  map(n => &#123;
    if (n === 2) throw new Error('Value 2 forbidden!');
    return n;
  &#125;),
  catchError(err => of('Caught: ' + err.message))
)
// 1  'Caught: Value 2 forbidden!'</pre>
              <button type="button" class="run-btn" (click)="runCatchError()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="catchErrorOut.set([])">clear</button>
                @for (line of catchErrorOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!catchErrorOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>retry()</h3>
              <p class="desc">
                Resubscribe to the source Observable up to N times when it errors.
                Essential for flaky network requests. Use <code>retry(&#123; count, delay &#125;)</code>
                for exponential back-off.
              </p>
              <pre class="code">// source fails on attempts 1 and 2, succeeds on 3
failingSource$.pipe(retry(3))
  .subscribe(&#123;
    next: v => console.log(v),
    error: e => console.error(e)
  &#125;)</pre>
              <button type="button" class="run-btn" (click)="runRetry()">Run (fails 2×, succeeds 3rd)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="retryOut.set([])">clear</button>
                @for (line of retryOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!retryOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ MULTICASTING ░░░ -->
        @case ('multicasting') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>Subject</h3>
              <p class="desc">
                A multicast Observable that is also an Observer. Multiple subscribers share the same
                execution. Does <em>not</em> replay values to late subscribers.
              </p>
              <pre class="code">const s = new Subject();
s.subscribe(v => console.log('A:', v));
s.subscribe(v => console.log('B:', v));
s.next(1); s.next(2); s.next(3);</pre>
              <button type="button" class="run-btn" (click)="runSubject()">Emit to 2 subscribers</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="subjectOut.set([])">clear</button>
                @for (line of subjectOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!subjectOut().length) { <span class="empty">— press Emit —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>BehaviorSubject</h3>
              <p class="desc">
                Like a Subject, but stores the last emitted value and immediately delivers it to any
                new subscriber. Always has a current value accessible via <code>.value</code>.
              </p>
              <pre class="code">const bs = new BehaviorSubject(0);
bs.next(10); bs.next(42);
bs.subscribe(v => console.log(v)); // immediately logs 42
bs.next(99);                       // subscriber gets 99</pre>
              <button type="button" class="run-btn" (click)="runBehaviorSubject()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="behaviorSubjectOut.set([])">clear</button>
                @for (line of behaviorSubjectOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!behaviorSubjectOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>ReplaySubject</h3>
              <p class="desc">
                Replays the last N values to every new subscriber, regardless of when they subscribe.
                Use <code>new ReplaySubject(N)</code> to set the buffer size.
              </p>
              <pre class="code">const rs = new ReplaySubject(3);
[1, 2, 3, 4, 5].forEach(n => rs.next(n));
// late subscriber joins after all 5 emissions:
rs.subscribe(v => console.log(v)); // gets 3, 4, 5</pre>
              <button type="button" class="run-btn" (click)="runReplaySubject()">Run (replay 3)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="replaySubjectOut.set([])">clear</button>
                @for (line of replaySubjectOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!replaySubjectOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>shareReplay()</h3>
              <p class="desc">
                Share a single Observable execution among multiple subscribers AND replay the last N
                values to late subscribers. Ideal for HTTP requests that multiple components need.
              </p>
              <pre class="code">const shared$ = http.get('/api/data').pipe(shareReplay(1));
// Both components subscribe but only ONE HTTP call is made.
// Late subscriber immediately gets the cached response.</pre>
              <button type="button" class="run-btn" (click)="runShareReplay()">Run (late sub at 700ms)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="shareReplayOut.set([])">clear</button>
                @for (line of shareReplayOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!shareReplayOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

          </section>
        }

        <!-- ░░░ UTILITY ░░░ -->
        @case ('utility') {
          <section class="demos-grid">

            <div class="demo-card">
              <h3>tap()</h3>
              <p class="desc">
                Perform side effects (logging, debugging, analytics) without modifying the stream.
                Values pass through unchanged.
              </p>
              <pre class="code">of(1, 2, 3).pipe(
  tap(n => console.log('before:', n)),
  map(n => n * 10),
  tap(n => console.log('after:', n))
)</pre>
              <button type="button" class="run-btn" (click)="runTap()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="tapOut.set([])">clear</button>
                @for (line of tapOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!tapOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>delay()</h3>
              <p class="desc">Shift all emissions forward in time by N milliseconds.</p>
              <pre class="code">of('Hello, delayed world!').pipe(delay(800))
// nothing for 800ms, then the value arrives</pre>
              <button type="button" class="run-btn" (click)="runDelay()">Run (800ms delay)</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="delayOut.set([])">clear</button>
                @for (line of delayOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!delayOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

            <div class="demo-card">
              <h3>finalize()</h3>
              <p class="desc">
                Execute a callback when the Observable terminates — whether by complete, error,
                or unsubscription. Use it to release resources or update UI state.
              </p>
              <pre class="code">of('value-1', 'value-2').pipe(
  tap(v => console.log('next:', v)),
  finalize(() => console.log('finalize() ran!'))
)</pre>
              <button type="button" class="run-btn" (click)="runFinalize()">Run</button>
              <div class="output">
                <button class="clear-btn" type="button" (click)="finalizeOut.set([])">clear</button>
                @for (line of finalizeOut(); track $index) { <div class="line">{{ line }}</div> }
                @if (!finalizeOut().length) { <span class="empty">— press Run —</span> }
              </div>
            </div>

          </section>
        }
      }
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page {
        min-height: 100dvh;
        padding: 1.5rem 2rem 3rem;
        background: linear-gradient(160deg, #f4f6fb, #eef2f8);
        color: #1a2030;
      }

      .back-link {
        color: #2a5298;
        font-weight: 600;
        text-decoration: none;
        font-size: 0.9rem;
      }

      .back-link:hover {
        text-decoration: underline;
      }

      .hero {
        max-width: 58rem;
        margin: 0.75rem 0 1.25rem;
      }

      h1 {
        margin: 0 0 0.5rem;
        font-size: clamp(1.7rem, 2.5vw, 2.4rem);
      }

      .hero p {
        margin: 0;
        line-height: 1.5;
        color: #3a4560;
      }

      /* ── Category tabs ── */
      .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 1.5rem;
      }

      .cat-btn {
        padding: 0.38rem 1rem;
        border-radius: 999px;
        border: 2px solid #c8d4e8;
        background: #fff;
        color: #2d4060;
        font-weight: 600;
        font-size: 0.82rem;
        cursor: pointer;
        transition: background 0.14s, border-color 0.14s, color 0.14s;
      }

      .cat-btn:hover {
        border-color: #2a52a0;
        color: #2a52a0;
      }

      .cat-btn.active {
        background: #1a3a70;
        color: #fff;
        border-color: #1a3a70;
      }

      /* ── Demo grid ── */
      .demos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 1.1rem;
      }

      .demo-card {
        background: #fff;
        border: 1px solid #d4dcea;
        border-radius: 0.9rem;
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        box-shadow: 0 2px 8px #1a307010;
      }

      h3 {
        margin: 0;
        font-size: 1.05rem;
        font-family: 'Courier New', Courier, monospace;
        color: #0f1f45;
        letter-spacing: 0.01em;
      }

      .desc {
        margin: 0;
        font-size: 0.86rem;
        color: #4a5568;
        line-height: 1.5;
      }

      code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.82em;
        background: #eef1f8;
        padding: 0.1em 0.35em;
        border-radius: 0.28em;
      }

      /* ── Code snippet ── */
      .code {
        background: #1b2235;
        color: #c8d8f4;
        padding: 0.7rem 0.9rem;
        border-radius: 0.55rem;
        font-size: 0.77rem;
        font-family: 'Courier New', Courier, monospace;
        overflow-x: auto;
        white-space: pre;
        line-height: 1.55;
        margin: 0;
      }

      /* ── Buttons ── */
      .run-btn {
        align-self: flex-start;
        background: #1a3a70;
        color: #fff;
        border: none;
        border-radius: 0.5rem;
        padding: 0.38rem 0.9rem;
        font-size: 0.83rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.14s;
        letter-spacing: 0.01em;
      }

      .run-btn:hover {
        background: #0e2550;
      }

      .hint {
        font-size: 0.78rem;
        color: #6b7a9a;
        font-style: italic;
      }

      /* ── Demo input ── */
      .demo-input {
        padding: 0.4rem 0.65rem;
        border: 1px solid #b4c4da;
        border-radius: 0.45rem;
        font-size: 0.88rem;
        width: 100%;
        box-sizing: border-box;
        color: #1a2030;
        background: #f8fafd;
      }

      /* ── Output area ── */
      .output {
        position: relative;
        background: #f2f5fc;
        border: 1px solid #c4d0e8;
        border-radius: 0.5rem;
        padding: 0.5rem 0.7rem 0.5rem;
        min-height: 5rem;
        max-height: 12rem;
        overflow-y: auto;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.79rem;
        flex: 1;
      }

      .line {
        line-height: 1.65;
        color: #1a2840;
      }

      .empty {
        color: #8a9ab8;
        font-style: italic;
      }

      .clear-btn {
        position: absolute;
        top: 0.28rem;
        right: 0.4rem;
        background: none;
        border: none;
        color: #8a9ab8;
        font-size: 0.72rem;
        cursor: pointer;
        padding: 0.1rem 0.3rem;
        border-radius: 0.25rem;
        font-family: inherit;
      }

      .clear-btn:hover {
        color: #c0392b;
        background: #fdecea;
      }
    `,
  ],
})
export class RxjsExamplesComponent {
  readonly categories = CATEGORIES;
  readonly activeCategory = signal<Category>('creation');

  // ── Creation outputs ──────────────────────────────────────────────────────
  readonly ofOut = signal<string[]>([]);
  readonly fromOut = signal<string[]>([]);
  readonly fromPromiseOut = signal<string[]>([]);
  readonly intervalOut = signal<string[]>([]);
  readonly timerOut = signal<string[]>([]);
  readonly rangeOut = signal<string[]>([]);

  // ── Transformation outputs ────────────────────────────────────────────────
  readonly mapOut = signal<string[]>([]);
  readonly switchMapOut = signal<string[]>([]);
  readonly mergeMapOut = signal<string[]>([]);
  readonly concatMapOut = signal<string[]>([]);
  readonly exhaustMapOut = signal<string[]>([]);
  readonly scanOut = signal<string[]>([]);

  // ── Filtering outputs ─────────────────────────────────────────────────────
  readonly filterOut = signal<string[]>([]);
  readonly takeOut = signal<string[]>([]);
  readonly skipOut = signal<string[]>([]);
  readonly debounceOut = signal<string[]>([]);
  readonly throttleOut = signal<string[]>([]);
  readonly distinctOut = signal<string[]>([]);
  readonly takeWhileOut = signal<string[]>([]);

  // ── Combination outputs ───────────────────────────────────────────────────
  readonly combineLatestOut = signal<string[]>([]);
  readonly mergeOut = signal<string[]>([]);
  readonly concatOut = signal<string[]>([]);
  readonly forkJoinOut = signal<string[]>([]);
  readonly zipOut = signal<string[]>([]);
  readonly startWithOut = signal<string[]>([]);
  readonly withLatestFromOut = signal<string[]>([]);

  // ── Error handling outputs ────────────────────────────────────────────────
  readonly catchErrorOut = signal<string[]>([]);
  readonly retryOut = signal<string[]>([]);

  // ── Multicasting outputs ──────────────────────────────────────────────────
  readonly subjectOut = signal<string[]>([]);
  readonly behaviorSubjectOut = signal<string[]>([]);
  readonly replaySubjectOut = signal<string[]>([]);
  readonly shareReplayOut = signal<string[]>([]);

  // ── Utility outputs ───────────────────────────────────────────────────────
  readonly tapOut = signal<string[]>([]);
  readonly delayOut = signal<string[]>([]);
  readonly finalizeOut = signal<string[]>([]);

  // ── Subjects for interactive demos ───────────────────────────────────────
  private readonly switchMapTrigger$ = new Subject<void>();
  private readonly mergeMapTrigger$ = new Subject<void>();
  private readonly exhaustMapTrigger$ = new Subject<void>();
  private readonly scanTrigger$ = new Subject<void>();
  private readonly throttleTrigger$ = new Subject<void>();
  private readonly debounceSearch$ = new Subject<string>();
  private readonly withLatestFromTrigger$ = new Subject<void>();

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // switchMap — cancels previous inner subscription on new trigger
    this.switchMapTrigger$
      .pipe(
        switchMap(() =>
          timer(0, 300).pipe(
            take(4),
            map(i => `  inner-${i}`)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.switchMapOut, v));

    // mergeMap — each trigger adds a concurrent inner subscription
    let mergeSeq = 0;
    this.mergeMapTrigger$
      .pipe(
        mergeMap(() => {
          const id = ++mergeSeq;
          return timer(0, 300).pipe(
            take(3),
            map(i => `  #${id}: inner-${i}`)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.mergeMapOut, v));

    // exhaustMap — ignores triggers while inner observable is active
    let exhaustSeq = 0;
    this.exhaustMapTrigger$
      .pipe(
        exhaustMap(() => {
          const id = ++exhaustSeq;
          return timer(0, 300).pipe(
            take(4),
            map(i => `  #${id}: inner-${i}`)
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.exhaustMapOut, v));

    // scan — running click counter
    this.scanTrigger$
      .pipe(
        scan(acc => acc + 1, 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.scanOut, `Count: ${v}`));

    // throttleTime — 1 per second
    this.throttleTrigger$
      .pipe(
        throttleTime(1000),
        scan(acc => acc + 1, 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.throttleOut, `Passed through #${v}`));

    // debounceTime — wait 400ms of silence
    this.debounceSearch$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.debounceOut, `Debounced: "${v}"`));

    // withLatestFrom — sample a background timer value on each click
    this.withLatestFromTrigger$
      .pipe(
        withLatestFrom(timer(0, 500)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([, timerVal]) =>
        this.append(this.withLatestFromOut, `Clicked — timer was at: ${timerVal}`)
      );
  }

  // ── Helper ─────────────────────────────────────────────────────────────────
  private append(sig: WritableSignal<string[]>, value: string): void {
    sig.update(lines => [...lines.slice(-14), value]);
  }

  // ── Creation demos ─────────────────────────────────────────────────────────
  runOf(): void {
    this.ofOut.set([]);
    of(1, 'hello', true, null).subscribe(v => this.append(this.ofOut, String(v)));
    this.append(this.ofOut, '→ complete');
  }

  runFrom(): void {
    this.fromOut.set([]);
    from([10, 20, 30, 40]).subscribe(v => this.append(this.fromOut, String(v)));
    this.append(this.fromOut, '→ complete');
  }

  runFromPromise(): void {
    this.fromPromiseOut.set([]);
    this.append(this.fromPromiseOut, 'Awaiting promise...');
    from(Promise.resolve({ user: 'Alice', role: 'admin' })).subscribe(v =>
      this.append(this.fromPromiseOut, JSON.stringify(v))
    );
  }

  runInterval(): void {
    this.intervalOut.set([]);
    interval(400)
      .pipe(take(5), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.intervalOut, String(v)),
        complete: () => this.append(this.intervalOut, '→ complete'),
      });
  }

  runTimer(): void {
    this.timerOut.set([]);
    this.append(this.timerOut, '(300ms initial delay...)');
    timer(300, 300)
      .pipe(take(5), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.timerOut, String(v)),
        complete: () => this.append(this.timerOut, '→ complete'),
      });
  }

  runRange(): void {
    this.rangeOut.set([]);
    range(1, 8).subscribe(v => this.append(this.rangeOut, String(v)));
    this.append(this.rangeOut, '→ complete');
  }

  // ── Transformation demos ───────────────────────────────────────────────────
  runMap(): void {
    this.mapOut.set([]);
    of(1, 2, 3, 4, 5)
      .pipe(map(x => x * x))
      .subscribe(v => this.append(this.mapOut, `${Math.sqrt(v)} → ${v}`));
    this.append(this.mapOut, '→ complete');
  }

  triggerSwitchMap(): void {
    this.append(this.switchMapOut, '— TRIGGER (prev inner cancelled) —');
    this.switchMapTrigger$.next();
  }

  triggerMergeMap(): void {
    this.append(this.mergeMapOut, '— TRIGGER (new parallel inner) —');
    this.mergeMapTrigger$.next();
  }

  runConcatMap(): void {
    this.concatMapOut.set([]);
    of('A', 'B', 'C')
      .pipe(
        concatMap(letter =>
          timer(0, 200).pipe(
            take(2),
            map(i => `${letter}${i}`)
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: v => this.append(this.concatMapOut, v),
        complete: () => this.append(this.concatMapOut, '→ complete'),
      });
  }

  triggerExhaustMap(): void {
    this.append(this.exhaustMapOut, '— TRIGGER sent —');
    this.exhaustMapTrigger$.next();
  }

  triggerScan(): void {
    this.scanTrigger$.next();
  }

  // ── Filtering demos ────────────────────────────────────────────────────────
  runFilter(): void {
    this.filterOut.set([]);
    range(1, 10)
      .pipe(filter(n => n % 2 === 0))
      .subscribe(v => this.append(this.filterOut, `${v} (passes filter)`));
    this.append(this.filterOut, '→ complete');
  }

  runTake(): void {
    this.takeOut.set([]);
    interval(300)
      .pipe(take(5), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.takeOut, String(v)),
        complete: () => this.append(this.takeOut, '→ complete after 5'),
      });
  }

  runSkip(): void {
    this.skipOut.set([]);
    range(1, 8)
      .pipe(skip(3))
      .subscribe(v => this.append(this.skipOut, String(v)));
    this.append(this.skipOut, '→ complete (skipped 1,2,3)');
  }

  onDebounceInput(event: Event): void {
    this.debounceSearch$.next((event.target as HTMLInputElement).value);
  }

  triggerThrottle(): void {
    this.throttleTrigger$.next();
  }

  runDistinct(): void {
    this.distinctOut.set([]);
    of(1, 1, 2, 2, 3, 1, 1)
      .pipe(distinctUntilChanged())
      .subscribe(v => this.append(this.distinctOut, String(v)));
    this.append(this.distinctOut, '→ complete (suppressed 3 duplicates)');
  }

  runTakeWhile(): void {
    this.takeWhileOut.set([]);
    interval(200)
      .pipe(
        takeWhile(n => n < 5),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: v => this.append(this.takeWhileOut, String(v)),
        complete: () => this.append(this.takeWhileOut, '→ complete (condition false at 5)'),
      });
  }

  // ── Combination demos ──────────────────────────────────────────────────────
  runCombineLatest(): void {
    this.combineLatestOut.set([]);
    combineLatest([
      timer(0, 400).pipe(take(4), map(n => `A:${n}`)),
      timer(200, 600).pipe(take(3), map(n => `B:${n}`)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([a, b]) => this.append(this.combineLatestOut, `[${a}, ${b}]`),
        complete: () => this.append(this.combineLatestOut, '→ complete'),
      });
  }

  runMerge(): void {
    this.mergeOut.set([]);
    merge(
      timer(0, 500).pipe(
        take(3),
        map(n => `A:${n}`)
      ),
      timer(250, 500).pipe(
        take(3),
        map(n => `B:${n}`)
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.mergeOut, v),
        complete: () => this.append(this.mergeOut, '→ complete'),
      });
  }

  runConcat(): void {
    this.concatOut.set([]);
    concat(
      of('sync-A', 'sync-B'),
      timer(0, 300).pipe(
        take(3),
        map(n => `delayed-${n}`)
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.concatOut, v),
        complete: () => this.append(this.concatOut, '→ complete'),
      });
  }

  runForkJoin(): void {
    this.forkJoinOut.set([]);
    this.append(this.forkJoinOut, 'Waiting for all sources to complete...');
    forkJoin({
      user: of('Alice').pipe(delay(400)),
      posts: of(42).pipe(delay(800)),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.append(this.forkJoinOut, JSON.stringify(result));
        this.append(this.forkJoinOut, '→ complete');
      });
  }

  runZip(): void {
    this.zipOut.set([]);
    zip(of('A', 'B', 'C'), of(1, 2, 3)).subscribe({
      next: ([letter, num]) => this.append(this.zipOut, `[${letter}, ${num}]`),
      complete: () => this.append(this.zipOut, '→ complete'),
    });
  }

  runStartWith(): void {
    this.startWithOut.set([]);
    interval(400)
      .pipe(take(4), startWith(-1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.startWithOut, v === -1 ? `-1 ← startWith value` : String(v)),
        complete: () => this.append(this.startWithOut, '→ complete'),
      });
  }

  triggerWithLatestFrom(): void {
    this.withLatestFromTrigger$.next();
  }

  // ── Error handling demos ───────────────────────────────────────────────────
  runCatchError(): void {
    this.catchErrorOut.set([]);
    of(1, 2, 3)
      .pipe(
        map(n => {
          if (n === 2) throw new Error('Value 2 is forbidden!');
          return n;
        }),
        catchError(err => of(`Caught: "${err.message}"`))
      )
      .subscribe({
        next: v => this.append(this.catchErrorOut, String(v)),
        complete: () => this.append(this.catchErrorOut, '→ complete (recovered)'),
      });
  }

  runRetry(): void {
    this.retryOut.set([]);
    let attempt = 0;
    new Observable<string>(subscriber => {
      attempt++;
      this.append(this.retryOut, `Attempt #${attempt}...`);
      if (attempt < 3) {
        subscriber.error(`Network error on attempt ${attempt}`);
      } else {
        subscriber.next(`Success on attempt ${attempt}!`);
        subscriber.complete();
      }
    })
      .pipe(retry(3), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.retryOut, `✓ ${v}`),
        error: e => this.append(this.retryOut, `✗ Gave up: ${e}`),
      });
  }

  // ── Multicasting demos ─────────────────────────────────────────────────────
  runSubject(): void {
    this.subjectOut.set([]);
    const s = new Subject<number>();
    s.subscribe(v => this.append(this.subjectOut, `Sub A: ${v}`));
    s.subscribe(v => this.append(this.subjectOut, `Sub B: ${v}`));
    [1, 2, 3].forEach(n => s.next(n));
    s.complete();
    this.append(this.subjectOut, '→ complete');
  }

  runBehaviorSubject(): void {
    this.behaviorSubjectOut.set([]);
    const bs = new BehaviorSubject(0);
    bs.next(10);
    bs.next(42);
    this.append(this.behaviorSubjectOut, `Current value before subscribe: ${bs.value}`);
    bs.subscribe(v => this.append(this.behaviorSubjectOut, `Sub receives: ${v}`));
    this.append(this.behaviorSubjectOut, '— subscribes, gets 42 immediately —');
    bs.next(99);
    bs.complete();
    this.append(this.behaviorSubjectOut, `→ complete, final value: ${bs.value}`);
  }

  runReplaySubject(): void {
    this.replaySubjectOut.set([]);
    const rs = new ReplaySubject<number>(3);
    [1, 2, 3, 4, 5].forEach(n => {
      rs.next(n);
      this.append(this.replaySubjectOut, `Emitted: ${n}`);
    });
    this.append(this.replaySubjectOut, '— late subscriber joins (buffer=3) —');
    rs.subscribe(v => this.append(this.replaySubjectOut, `Late sub got: ${v}`));
    rs.complete();
  }

  runShareReplay(): void {
    this.shareReplayOut.set([]);
    let sourceCallCount = 0;
    const shared$ = timer(0, 400).pipe(
      take(5),
      tap(() => {
        sourceCallCount++;
        this.append(this.shareReplayOut, `Source emission #${sourceCallCount}`);
      }),
      shareReplay(1)
    );

    shared$
      .pipe(
        map(n => `Sub A sees: ${n}`),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.append(this.shareReplayOut, v));

    // Late subscriber joins after 700ms — gets last replayed value immediately
    timer(700)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.append(this.shareReplayOut, '— Sub B joins at 700ms (gets replayed value) —');
        shared$
          .pipe(
            map(n => `Sub B sees: ${n}`),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: v => this.append(this.shareReplayOut, v),
            complete: () => this.append(this.shareReplayOut, '→ complete'),
          });
      });
  }

  // ── Utility demos ──────────────────────────────────────────────────────────
  runTap(): void {
    this.tapOut.set([]);
    of(1, 2, 3)
      .pipe(
        tap(n => this.append(this.tapOut, `tap before map: ${n}`)),
        map(n => n * 10),
        tap(n => this.append(this.tapOut, `tap after map:  ${n}`))
      )
      .subscribe();
    this.append(this.tapOut, '→ complete');
  }

  runDelay(): void {
    this.delayOut.set([]);
    this.append(this.delayOut, 'Emitting... (800ms delay)');
    of('Hello, delayed world!')
      .pipe(delay(800), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: v => this.append(this.delayOut, v),
        complete: () => this.append(this.delayOut, '→ complete'),
      });
  }

  runFinalize(): void {
    this.finalizeOut.set([]);
    of('value-1', 'value-2')
      .pipe(
        tap(v => this.append(this.finalizeOut, `next: ${v}`)),
        finalize(() => this.append(this.finalizeOut, 'finalize() ran!'))
      )
      .subscribe({ complete: () => this.append(this.finalizeOut, '→ complete') });
  }
}
