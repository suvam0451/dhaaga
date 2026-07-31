import {
	MessageCircle,
	Zap,
	Heart,
	Repeat,
	Share2,
	MoreHorizontal,
	ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthModal } from '@/context/AuthModalContext';

const posts = [
	{
		id: 1,
		user: {
			name: 'The Fishcake (nostr.build)',
			handle: 'thefishcake.com',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fishcake',
			verified: true,
		},
		content: 'Good night 🌙',
		time: '1 min.',
		stats: { comments: 0, zaps: 0, likes: 0, reposts: 0 },
	},
	{
		id: 2,
		user: {
			name: 'Cryptoast',
			handle: 'cryptoast@primal.net',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptoast',
			verified: true,
		},
		content:
			'Bourse : pourquoi Wall Street rachète alors que les investisseurs vendent\n\nAlors que les hedge funds et les investisseurs particuliers ont procédé à des ventes record ces derniers jours, plusieurs acteurs de Wall Street ont profité de cette vague de capitulation pour racheter des positions à prix cassés. Un comportement classique lors des épisodes de stress.\n\n👉 https://cryptoast.fr/bourse-pourquoi-wall-street-rachete-quand-investisseurs-vendent/\n\n#nostrfr',
		time: '4 min.',
		stats: { comments: 0, zaps: 0, likes: 0, reposts: 0 },
	},
	{
		id: 3,
		user: {
			name: 'PABLOF7z',
			handle: 'f7z.io',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pablo',
			verified: true,
		},
		content: 'January 3rd came really late this year',
		time: '4 min.',
		stats: { comments: 1, zaps: 21, likes: 1, reposts: 0 },
		zaps: 421,
	},
];

export function Feed() {
	const { open } = useAuthModal();

	return (
		<div className="flex-1 max-w-2xl border-r min-h-screen">
			<header className="sticky top-0 bg-background/80 backdrop-blur-md z-10 p-4 border-b flex justify-between items-center">
				<h1 className="text-2xl font-medium">Welcome to Dhaaga!</h1>
				<Button
					onClick={open}
					className="rounded-full bg-[#E08D3D] hover:bg-[#D07D2D] text-white px-6 cursor-pointer transition-colors"
				>
					User Manual
				</Button>
			</header>

			<div className="p-4 border-b">
				<button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
					Latest <ChevronDown className="w-4 h-4" />
				</button>
			</div>

			<div className="divide-y">
				{posts.map((post) => (
					<article
						key={post.id}
						className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
					>
						<div className="flex gap-3">
							<img
								src={post.user.avatar}
								className="w-12 h-12 rounded-full border"
								alt=""
							/>
							<div className="flex-1">
								<div className="flex justify-between items-start">
									<div className="flex items-center gap-1 flex-wrap">
										<span className="font-bold hover:underline">
											{post.user.name}
										</span>
										{post.user.verified && (
											<Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										)}
										<span className="text-muted-foreground">
											@{post.user.handle}
										</span>
										<span className="text-muted-foreground">· {post.time}</span>
									</div>
									<button className="text-muted-foreground hover:text-foreground">
										<MoreHorizontal className="w-5 h-5" />
									</button>
								</div>

								<div className="mt-2 text-[15px] leading-normal whitespace-pre-wrap">
									{post.content}
								</div>

								{post.zaps && (
									<div className="mt-3 flex items-center gap-1 text-xs bg-accent px-2 py-1 rounded-full w-fit">
										<img
											src="https://api.dicebear.com/7.x/avataaars/svg?seed=zap"
											className="w-4 h-4 rounded-full"
										/>
										<Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
										<span>{post.zaps}</span>
									</div>
								)}

								<div className="mt-4 flex justify-between text-muted-foreground max-w-md">
									<button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
										<MessageCircle className="w-5 h-5" />
										<span className="text-xs">{post.stats.comments || ''}</span>
									</button>
									<button className="flex items-center gap-2 hover:text-yellow-500 transition-colors">
										<Zap className="w-5 h-5" />
										<span className="text-xs">{post.stats.zaps || ''}</span>
									</button>
									<button className="flex items-center gap-2 hover:text-red-500 transition-colors">
										<Heart className="w-5 h-5" />
										<span className="text-xs">{post.stats.likes || ''}</span>
									</button>
									<button className="flex items-center gap-2 hover:text-green-500 transition-colors">
										<Repeat className="w-5 h-5" />
										<span className="text-xs">{post.stats.reposts || ''}</span>
									</button>
									<button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
										<Share2 className="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
