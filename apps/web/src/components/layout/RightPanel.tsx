import {
	Search,
	Code2,
	MessageCircle,
	Lock,
	Play,
	Smartphone,
	Globe,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';

const trending = [
	{
		id: 1,
		user: {
			name: 'derKUEKeNFunktionaer',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=derk',
		},
		time: '2 hr.',
		text: 'der KUEKeN, Kleiner Einschub: moralische Werturteile...',
	},
	{
		id: 2,
		user: {
			name: 'calle',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=calle',
		},
		time: '38 min.',
		text: 'This is worse than any previous Bitcoin exchange hack. It is arguably one of the...',
	},
	{
		id: 3,
		user: {
			name: 'jb55',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jb55',
		},
		time: '3 hr.',
		text: "was it odell or nvk who hired you at opensats? or does it matter it's one big...",
	},
	{
		id: 4,
		user: {
			name: 'lunaticoin',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
		},
		time: '3 hr.',
		text: 'L294 - EMERGENCIA @COLDCARDwallet - Qué ha pasado y...',
	},
];

export function RightPanel() {
	return (
		<div className="hidden lg:flex flex-col w-80 p-4 gap-6 sticky top-0 h-screen overflow-y-auto">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					placeholder="Search..."
					className="pl-10 bg-accent/50 border-none rounded-full h-11"
				/>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold">Trending 4h</h2>
					<button className="text-blue-500 text-sm font-medium">See all</button>
				</div>

				<div className="space-y-6">
					{trending.map((item) => (
						<div
							key={item.id}
							className="flex gap-3 items-start cursor-pointer hover:bg-accent/30 p-2 -m-2 rounded-lg transition-colors"
						>
							<img
								src={item.user.avatar}
								className="w-10 h-10 rounded-full border"
								alt=""
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-1 text-sm">
									<span className="font-bold truncate">{item.user.name}</span>
									<span className="text-muted-foreground">· {item.time}</span>
								</div>
								<p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
									{item.text}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-auto flex flex-col gap-4 px-2 pb-4">
				<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-muted-foreground/80">
					<a
						href="https://suvam.io/dhaaga"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<Globe className="w-4 h-4" />
						<span>Website</span>
					</a>
					<a
						href="https://github.com/suvam0451/dhaaga"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<Code2 className="w-4 h-4" />
						<span>Source Code</span>
					</a>
					<a
						href="https://discord.gg/kMp5JA9jwD"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<MessageCircle className="w-4 h-4" />
						<span>Discord</span>
					</a>
					<a
						href="https://github.com/suvam0451/dhaaga/blob/main/apps/mobile/PRIVACY_POLICY.md"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<Lock className="w-4 h-4" />
						<span>Privacy Policy</span>
					</a>
					<a
						href="https://play.google.com/store/apps/details?id=io.suvam.dhaaga"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<Play className="w-4 h-4" />
						<span>Google Play</span>
					</a>
					<a
						href="https://f-droid.org/en/packages/io.suvam.dhaaga.lite"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-foreground transition-colors"
					>
						<Smartphone className="w-4 h-4" />
						<span>F-Droid</span>
					</a>
				</div>
				<div className="flex flex-col items-center gap-2">
					<ThemeToggle />
					<div className="text-[11px] text-muted-foreground/60 font-mono text-center">
						Built with 💛 by Suvam
					</div>
				</div>
			</div>
		</div>
	);
}
