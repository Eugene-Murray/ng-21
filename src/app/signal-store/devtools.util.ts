interface ReduxDevToolsConnection {
  send(action: { type: string }, state: unknown): void;
}

interface ReduxDevToolsExtension {
  connect(options: { name: string }): ReduxDevToolsConnection;
}

function getDevToolsExtension(): ReduxDevToolsExtension | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (
    window as Window & {
      __REDUX_DEVTOOLS_EXTENSION__?: ReduxDevToolsExtension;
    }
  ).__REDUX_DEVTOOLS_EXTENSION__;
}

export function connectDevTools<TState>(storeName: string, getState: () => TState) {
  const devTools = getDevToolsExtension()?.connect({
    name: storeName
  });

  return (action: string): void => {
    devTools?.send({ type: action }, getState());
  };
}