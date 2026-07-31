import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const options = [
		{ value: 'light', icon: Sun, label: 'Light' },
		{ value: 'dark', icon: Moon, label: 'Dark' },
		{ value: 'system', icon: Monitor, label: 'System' },
	] as const;

	return (
		<div className="grid grid-cols-3 bg-accent/50 p-1 rounded-xl w-full max-w-[140px]">
			{options.map((option) => {
				const Icon = option.icon;
				const isActive = theme === option.value;
				return (
					<button
						key={option.value}
						onClick={() => setTheme(option.value)}
						aria-label={option.label}
						className={cn(
							"flex items-center justify-center p-2 rounded-lg transition-all duration-200 cursor-pointer",
							isActive 
								? "bg-background text-foreground shadow-sm" 
								: "text-muted-foreground hover:text-foreground"
						)}
					>
						<Icon className="w-[18px] h-[18px]" />
					</button>
				);
			})}
		</div>
	);
}
