import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

interface AuthModalContextType {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<AuthModalContext.Provider value={{ isOpen, open, close }}>
			{children}
		</AuthModalContext.Provider>
	);
}

export function useAuthModal() {
	const context = useContext(AuthModalContext);
	if (context === undefined) {
		throw new Error('useAuthModal must be used within an AuthModalProvider');
	}
	return context;
}
