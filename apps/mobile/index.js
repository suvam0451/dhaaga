import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// needed by atproto
import 'fast-text-encoding';

export function App() {
	const ctx = require.context('./app');
	return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
