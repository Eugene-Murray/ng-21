import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState
} from '@ngrx/signals';

export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  draft: string;
  filter: TodoFilter;
}

const initialState: TodoState = {
  todos: [],
  draft: '',
  filter: 'all'
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const currentTodos = todos();
      const currentFilter = filter();

      if (currentFilter === 'active') {
        return currentTodos.filter((todo) => !todo.completed);
      }

      if (currentFilter === 'completed') {
        return currentTodos.filter((todo) => todo.completed);
      }

      return currentTodos;
    }),
    totalCount: computed(() => todos().length),
    remainingCount: computed(() => todos().filter((todo) => !todo.completed).length),
    completedCount: computed(() => todos().filter((todo) => todo.completed).length)
  })),
  withMethods((store) => ({
    setDraft(text: string): void {
      patchState(store, { draft: text });
    },
    addTodo(): void {
      const text = store.draft().trim();
      if (!text) {
        return;
      }

      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false
      };

      patchState(store, (state) => ({
        todos: [...state.todos, newTodo],
        draft: ''
      }));
    },
    toggleTodo(id: number): void {
      patchState(store, (state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      }));
    },
    removeTodo(id: number): void {
      patchState(store, (state) => ({
        todos: state.todos.filter((todo) => todo.id !== id)
      }));
    },
    clearCompleted(): void {
      patchState(store, (state) => ({
        todos: state.todos.filter((todo) => !todo.completed)
      }));
    },
    setFilter(filter: TodoFilter): void {
      patchState(store, { filter });
    }
  }))
);
