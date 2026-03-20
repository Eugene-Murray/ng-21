import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoFilter, TodoStore } from '../../signal-store/todo.store';

type TodoStoreInstance = InstanceType<typeof TodoStore>;

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  readonly store: TodoStoreInstance = inject(TodoStore);

  setDraft(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setDraft(input.value);
  }

  addTodo(event?: Event): void {
    event?.preventDefault();
    this.store.addTodo();
  }

  setFilter(filter: TodoFilter): void {
    this.store.setFilter(filter);
  }
}
