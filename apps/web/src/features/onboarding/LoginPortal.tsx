import { useState } from 'preact/hooks';
import { LogIn, Sparkles, Cloud, AtSign, Key, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { generateDhaagaAuthStrategy } from '@dhaaga/bridge';

interface LoginPortalProps {
	isOpen: boolean;
	onClose: () => void;
}

type Provider = 'bluesky' | 'mastodon' | 'misskey';
type BlueskyAuthType = 'oauth' | 'app_password';

export function LoginPortal({ isOpen, onClose }: LoginPortalProps) {
	const [provider, setProvider] = useState<Provider>('mastodon');
	const [blueskyAuthType, setBlueskyAuthType] =
		useState<BlueskyAuthType>('oauth');

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[480px] border-none p-8">
				<DialogHeader className="flex flex-col items-center gap-4 pt-4">
					<DialogTitle className="text-4xl font-bold flex items-center gap-3">
						Add Account
					</DialogTitle>
					<DialogDescription className="text-muted-foreground text-center">
						Choose your preferred network to continue
					</DialogDescription>
				</DialogHeader>

				<div className="mt-6">
					<Tabs
						value={provider}
						onValueChange={(v) => setProvider(v as Provider)}
						className="w-full"
					>
						<TabsList className="grid grid-cols-3 bg-accent/50 p-1 h-20">
							<TabsTrigger
								value="bluesky"
								className="flex flex-col items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground h-full"
							>
								<img
									src="/assets/bluesky-logo.png"
									className="w-6 h-6 object-contain"
								/>
								<span className="text-xs">Bluesky</span>
							</TabsTrigger>
							<TabsTrigger
								value="mastodon"
								className="flex flex-col items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground h-full"
							>
								<img
									src="/assets/mastodon-logo.png"
									className="w-6 h-6 object-contain"
								/>
								<span className="text-xs">Mastodon</span>
							</TabsTrigger>
							<TabsTrigger
								value="misskey"
								className="flex flex-col items-center justify-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground h-full"
							>
								<img
									src="/assets/misskey-logo.png"
									className="w-6 h-6 object-contain"
								/>
								<span className="text-xs">Misskey</span>
							</TabsTrigger>
						</TabsList>

						<div className="mt-6 min-h-[380px]">
							<TabsContent value="bluesky" className="mt-0 space-y-6">
								<div className="flex flex-col items-center gap-3">
									<Label className="text-lg font-medium block text-center">
										{blueskyAuthType === 'oauth'
											? 'Enter Server URL'
											: 'Enter App Password'}
									</Label>
								</div>

								<div className="flex justify-center">
									<div className="bg-accent/50 p-1 rounded-lg inline-flex">
										<button
											onClick={() => setBlueskyAuthType('oauth')}
											className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
												blueskyAuthType === 'oauth'
													? 'bg-background text-foreground shadow-sm'
													: 'text-muted-foreground'
											}`}
										>
											OAuth
										</button>
										<button
											onClick={() => setBlueskyAuthType('app_password')}
											className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
												blueskyAuthType === 'app_password'
													? 'bg-background text-foreground shadow-sm'
													: 'text-muted-foreground'
											}`}
										>
											App Password
										</button>
									</div>
								</div>

								{blueskyAuthType === 'oauth' ? (
									<div className="space-y-4">
										<div className="flex items-center bg-accent/50 rounded-lg h-14 px-4">
											<Globe className="w-5 h-5 text-muted-foreground opacity-50 shrink-0" />
											<span className="text-lg text-muted-foreground ml-2 shrink-0 select-none">
												https://
											</span>
											<Input
												placeholder="bsky.social"
												className="bg-transparent border-none h-full text-lg pl-1 pr-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
											/>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="space-y-2">
											<Label className="text-sm font-medium">
												Username / Handle
											</Label>
											<div className="relative">
												<Input
													placeholder="user.bsky.social"
													className="bg-accent/50 border-none h-12 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
												<AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
											</div>
										</div>
										<div className="space-y-2">
											<Label className="text-sm font-medium">
												App Password
											</Label>
											<div className="relative">
												<Input
													type="password"
													placeholder="abcd-1234-efgh-5678"
													className="bg-accent/50 border-none h-12 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
												<Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
											</div>
										</div>
									</div>
								)}
							</TabsContent>

							<TabsContent value="mastodon" className="mt-0 space-y-6">
								<div className="flex flex-col items-center gap-3">
									<Label className="text-lg font-medium block text-center">
										Enter Instance URL
									</Label>
								</div>
								<div className="flex items-center bg-accent/50 rounded-lg h-14 px-4">
									<div className="text-muted-foreground shrink-0">
										<svg
											viewBox="0 0 24 24"
											className="w-5 h-5 fill-current opacity-50"
										>
											<path d="M21.32 9.55c0-4.03-2.5-5.27-2.5-5.27C17.2 3.63 14.6 3.5 14.6 3.5h-.02s-2.6.13-4.22.78c0 0-2.5 1.24-2.5 5.27 0 0-.03 2.7.07 5.42.1 3 .67 5.4 1.1 6.54.5 1.17 2.03 2.45 3.37 2.45 1.34 0 2.22-.5 2.22-.5l.1-2.28c-2.32.2-4.44-.6-4.86-3.04 0 0-.1-1.17-.1-1.55 0 0 2.42.6 5.13.53 2.7-.07 5.1-.73 5.1-.73s-.03-.43-.03-.92c0-3.66 0-10.42 0-10.42zm-3.35 10c-.35.1-.7.17-1.05.23-.35.05-.72.08-1.07.1-.35.03-.7.04-1.07.03-3.1-.03-5.3-.9-5.3-.9v-1.1c.3.1.6.2.9.27.3.07.6.14.9.18.3.04.6.07 1 .08 2.7.1 4.7-.6 4.7-.6v1.2z" />
										</svg>
									</div>
									<span className="text-lg text-muted-foreground ml-2 shrink-0 select-none">
										https://
									</span>
									<Input
										placeholder="mastodon.social"
										className="bg-transparent border-none h-full text-lg pl-1 pr-0 focus-visible:ring-0 flex-1"
									/>
								</div>
							</TabsContent>

							<TabsContent value="misskey" className="mt-0 space-y-6">
								<div className="flex flex-col items-center gap-3">
									<Label className="text-lg font-medium block text-center">
										Misskey Instance URL
									</Label>
								</div>
								<div className="flex items-center bg-accent/50 rounded-lg h-14 px-4">
									<Globe className="w-5 h-5 text-muted-foreground opacity-50 shrink-0" />
									<span className="text-lg text-muted-foreground ml-2 shrink-0 select-none">
										https://
									</span>
									<Input
										placeholder="misskey.io"
										className="bg-transparent border-none h-full text-lg pl-1 pr-0 focus-visible:ring-0 flex-1"
									/>
								</div>
							</TabsContent>
						</div>
					</Tabs>

					<div className="mt-8 mx-auto flex items-center gap-2 text-sm text-muted-foreground leading-relaxed">
						<Sparkles className="w-4 h-4 mt-1 flex-shrink-0" />
						<p>
							SNS not listed here?{' '}
							<a
								href="https://suvam.io/dhaaga/compatibility"
								target={'_blank'}
								className="text-[#E08D3D] hover:underline"
							>
								See if we support it!
							</a>
						</p>
					</div>

					<div className="flex justify-center pt-6">
						<Button className="h-12 px-8 rounded-lg flex items-center gap-2 text-lg min-w-[160px]">
							<LogIn className="w-5 h-5" />
							Sign in
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
