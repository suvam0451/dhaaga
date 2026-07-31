import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useMemo,
	useCallback,
} from 'react';

interface AuthModalContextType {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
	undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

	return (
		<AuthModalContext.Provider value={value}>
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
