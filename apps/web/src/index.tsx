import {
	LocationProvider,
	Router,
	Route,
	hydrate,
	prerender as ssr,
} from 'preact-iso';

import { Sidebar } from './components/layout/Sidebar';
import { Feed } from './components/layout/Feed';
import { RightPanel } from './components/layout/RightPanel';
import { NotFound } from './pages/_404.jsx';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPortal } from './features/onboarding/LoginPortal';
import './style.css';

function AppContent() {
	const { isOpen, close } = useAuthModal();
	return (
		<div className="flex justify-center bg-background min-h-screen">
			<div className="flex w-full max-w-300">
				<Sidebar />
				<main className="flex flex-1">
					<Router>
						<Route path="/" component={Feed} />
						<Route default component={NotFound} />
					</Router>
					<RightPanel />
				</main>
			</div>
			<LoginPortal isOpen={isOpen} onClose={close} />
		</div>
	);
}

export function App() {
	return (
		<LocationProvider>
			<ThemeProvider>
				<AuthModalProvider>
					<AppContent />
				</AuthModalProvider>
			</ThemeProvider>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
