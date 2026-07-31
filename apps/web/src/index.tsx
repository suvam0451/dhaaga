import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Sidebar } from './components/layout/Sidebar';
import { Feed } from './components/layout/Feed';
import { RightPanel } from './components/layout/RightPanel';
import { NotFound } from './pages/_404';
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
					<Routes>
						<Route path="/" element={<Feed />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					<RightPanel />
				</main>
			</div>
			<LoginPortal isOpen={isOpen} onClose={close} />
		</div>
	);
}

export function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AuthModalProvider>
					<AppContent />
				</AuthModalProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}

const container = document.getElementById('app');
if (container) {
	const root = createRoot(container);
	root.render(<App />);
}
