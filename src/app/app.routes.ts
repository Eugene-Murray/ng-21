import { Routes } from '@angular/router';
import { TodoComponent } from './pages/todo/todo.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'feature-lab',
		pathMatch: 'full'
	},
	{
		path: 'feature-lab',
		loadComponent: () =>
			import('./pages/feature-lab/feature-lab-home.component').then(
				(m) => m.FeatureLabHomeComponent
			)
	},
	{
		path: 'features/io-model',
		loadComponent: () =>
			import('./pages/feature-lab/io-model-demo.component').then(
				(m) => m.IoModelDemoComponent
			)
	},
	{
		path: 'features/linked-signal',
		loadComponent: () =>
			import('./pages/feature-lab/linked-signal-demo.component').then(
				(m) => m.LinkedSignalDemoComponent
			)
	},
	{
		path: 'features/resource',
		loadComponent: () =>
			import('./pages/feature-lab/resource-demo.component').then(
				(m) => m.ResourceDemoComponent
			)
	},
	{
		path: 'features/http-resource',
		loadComponent: () =>
			import('./pages/feature-lab/http-resource-demo.component').then(
				(m) => m.HttpResourceDemoComponent
			)
	},
	{
		path: 'features/render-effects',
		loadComponent: () =>
			import('./pages/feature-lab/render-effects-demo.component').then(
				(m) => m.RenderEffectsDemoComponent
			)
	},
	{
		path: 'features/defer',
		loadComponent: () =>
			import('./pages/feature-lab/defer-demo.component').then((m) => m.DeferDemoComponent)
	},
	{
		path: 'features/animations',
		loadComponent: () =>
			import('./pages/feature-lab/animations-demo.component').then(
				(m) => m.AnimationsDemoComponent
			)
	},
	{
		path: 'features/agentic-starter',
		loadComponent: () =>
			import('./pages/agentic/agentic-starter.component').then(
				(m) => m.AgenticStarterComponent
			)
	},
	{
		path: 'ai-text-editor',
		loadComponent: () =>
			import('./pages/ai-text-editor/ai-text-editor.component').then(
				(m) => m.AiTextEditorComponent
			)
	},
	{
		path: 'ai-chatbot',
		loadComponent: () =>
			import('./pages/ai-chatbot/ai-chatbot.component').then(
				(m) => m.AiChatbotComponent
			)
	},
	{
		path: 'todo',
		component: TodoComponent
	},
	{
		path: 'signals',
		loadComponent: () =>
			import('./pages/signals/signals.component').then((m) => m.SignalsComponent)
	},
	{
		path: 'aria-showcase',
		loadComponent: () =>
			import('./pages/aria/aria-showcase.component').then((m) => m.AriaShowcaseComponent)
	},
	{
		path: 'signal-forms',
		loadComponent: () =>
			import('./pages/signal-forms/signal-forms.component').then(
				(m) => m.SignalFormsComponent
			)
	},
	{
		path: 'rxjs-examples',
		loadComponent: () =>
			import('./pages/rxjs/rxjs-examples.component').then(
				(m) => m.RxjsExamplesComponent
			)
	},
	{
		path: 'material-examples',
		loadComponent: () =>
			import('./pages/material/material-examples.component').then(
				(m) => m.MaterialExamplesComponent
			)
	},
	{
		path: '**',
		redirectTo: 'feature-lab'
	}
];
