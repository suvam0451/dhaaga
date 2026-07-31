import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useMemo,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			return (localStorage.getItem('theme') as Theme) || 'system';
		}
		return 'system';
	});

	useEffect(() => {
		const root = window.document.documentElement;

		const applyTheme = (t: Theme) => {
			root.classList.remove('light', 'dark');
			if (t === 'system') {
				const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
					.matches
					? 'dark'
					: 'light';
				root.classList.add(systemTheme);
			} else {
				root.classList.add(t);
			}
		};

		applyTheme(theme);
		localStorage.setItem('theme', theme);

		if (theme === 'system') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			const handleChange = () => applyTheme('system');
			mediaQuery.addEventListener('change', handleChange);
			return () => mediaQuery.removeEventListener('change', handleChange);
		}
	}, [theme]);

	const value = useMemo(() => ({ theme, setTheme }), [theme]);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
