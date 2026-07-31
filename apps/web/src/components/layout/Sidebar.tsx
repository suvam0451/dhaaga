import {
	Home,
	BookOpen,
	Compass,
	Mail,
	Bookmark,
	Bell,
	Download,
	ShieldCheck,
	Settings,
	Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthModal } from '@/context/AuthModalContext';

const navItems = [
	{ icon: Home, label: 'Home', active: true },
	{ icon: BookOpen, label: 'Reads' },
	{ icon: Compass, label: 'Explore' },
	{ icon: Mail, label: 'Messages' },
	{ icon: Bookmark, label: 'Bookmarks' },
	{ icon: Bell, label: 'Notifications' },
	{ icon: Download, label: 'Downloads' },
	{ icon: Settings, label: 'Settings' },
];

export function Sidebar() {
	const { open } = useAuthModal();

	return (
		<div className="flex flex-col h-screen p-4 border-r w-64 sticky top-0">
			<div className="flex flex-col mb-8 px-2">
				<div className="flex items-center gap-2">
					<img
						src={'/assets/dhaaga-icon.png'}
						width={48}
						height={48}
						className="rounded-lg"
					/>
					<div className={'flex-column'}>
						<div className="text-2xl medium">Dhaaga</div>
						<div className="text-sm text-muted-foreground ml-1 mt-0.5 opacity-70">
							v0.19.3
						</div>
					</div>
				</div>
			</div>

			<nav className="flex-1 space-y-1">
				{navItems.map((item) => (
					<a
						key={item.label}
						href="#"
						className={cn(
							'flex items-center gap-4 px-3 py-2 rounded-lg text-lg font-normal transition-colors',
							item.active
								? 'text-foreground'
								: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
						)}
					>
						<item.icon className="w-6 h-6" />
						{item.label}
					</a>
				))}
			</nav>

			<div className="mt-auto pt-4 flex flex-col gap-4">
				<div className="px-3 py-4 bg-accent/50 rounded-xl text-center">
					<p className="text-sm mb-4 text-[#E08D3D] hover:text-[#D07D2D] transition-colors cursor-pointer">
						how to use the app?
					</p>
					<div className="flex items-center gap-3 p-2 bg-background/50 rounded-lg mb-4 text-left border border-border/50">
						<img
							src="https://api.dicebear.com/7.x/avataaars/svg?seed=Suvam"
							className="w-9 h-9 rounded-full bg-accent"
							alt=""
						/>
						<div className="flex-1 min-w-0">
							<div className="text-sm font-bold truncate">Suvam</div>
							<div className="text-[11px] text-muted-foreground truncate">
								suvam@dhaaga.app
							</div>
						</div>
					</div>
					<Button
						onClick={open}
						className="w-full rounded-full bg-[#E08D3D] hover:bg-[#D07D2D] text-white font-bold cursor-pointer transition-colors"
					>
						Add Account
					</Button>
				</div>
			</div>
		</div>
	);
}
