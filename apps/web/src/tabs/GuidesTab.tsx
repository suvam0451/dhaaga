'use client';

import * as React from 'react';
import {
	Play,
	Settings,
	Shield,
	Camera,
	TrendingUp,
	BookOpen,
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

interface GuidesSection {
	isActive: boolean;
}

// Guide structure with nested sections
const guideStructure = [
	{
		id: 'getting-started',
		title: 'Getting Started',
		icon: Play,
		items: [
			{ id: 'account-setup', title: 'Accounts' },
			{ id: 'first-video', title: 'Hub Area' },
			{ id: 'profile-creation', title: 'Profiles' },
		],
	},
	{
		id: 'creating-content',
		title: 'Creating Content',
		icon: Camera,
		items: [
			{ id: 'video-recording', title: 'Video Recording' },
			{ id: 'editing-tools', title: 'Editing Tools' },
			{ id: 'adding-effects', title: 'Adding Effects' },
			{ id: 'music-sounds', title: 'Music & Sounds' },
		],
	},
	{
		id: 'growing-audience',
		title: 'Growing Your Audience',
		icon: TrendingUp,
		items: [
			{ id: 'hashtags', title: 'Using Hashtags' },
			{ id: 'engagement', title: 'Engagement Tips' },
			{ id: 'collaborations', title: 'Collaborations' },
			{ id: 'trends', title: 'Following Trends' },
		],
	},
	{
		id: 'community',
		title: 'Community & Safety',
		icon: Shield,
		items: [
			{ id: 'community-guidelines', title: 'Community Guidelines' },
			{ id: 'reporting', title: 'Reporting Content' },
			{ id: 'privacy-settings', title: 'Privacy Settings' },
			{ id: 'blocking-users', title: 'Blocking Users' },
		],
	},
	{
		id: 'features',
		title: 'Features & Tools',
		icon: Settings,
		items: [
			{ id: 'live-streaming', title: 'Live Streaming' },
			{ id: 'duets-stitches', title: 'Duets & Stitches' },
			{ id: 'analytics', title: 'Analytics' },
			{ id: 'monetization', title: 'Monetization' },
		],
	},
];

// Q&A content for each guide item
const guideContent: Record<
	string,
	{ questions: Array<{ q: string; a: string }> }
> = {
	'account-setup': {
		questions: [
			{
				q: 'How do I add my social account?',
				a: 'You can add a new account from the sidebar to the left. If you are new to Dhaaga, then your home page will prompt and guide you in this process.',
			},
			{
				q: 'What platforms are supported?',
				a: 'Bluesky, Mastodon, Misskey, Pleroma and most of their soft forks. If your fork is missing, let me know!',
			},
			{
				q: 'My profile information is outdated ?',
				a: 'As of the most recent version, profile refreshes are done manually. So, just visit your profile tab and there should be a button to refresh the info!',
			},
		],
	},
	'profile-creation': {
		questions: [
			{
				q: 'What is a profile in Dhaaga ?',
				a: 'Each profile lets you have a separate hub arrangement and theme. For example, you can use a "Sports" profile during live tournaments and switch back to a "Art" profile to gather inspiration.',
			},
			{
				q: 'Can I populate my hub using pins from multiple profiles?',
				a: 'You can only compose your hub using pins from the currently active profile. This is for ease of use and simplicity.',
			},
			{
				q: 'How to manage my profiles ?',
				a: 'A dedicated section of the app covers this use case.',
			},
		],
	},
	'first-video': {
		questions: [
			{
				q: 'How does the Social Hub work ?',
				a: 'With Dhaaga, you create your own timeline views. Unlike deck based interfaces, you pin your favourite destinations (users, feeds, tags) in advance and simply drag and drop the pins into the deck area to visit it.',
			},
			{
				q: 'How long should my first video be?',
				a: 'Videos can be up to 10 minutes long, but for your first video, aim for 15-60 seconds. This length is perfect for maintaining viewer attention and is easier to create as a beginner.',
			},
			{
				q: 'Do I need special equipment?',
				a: 'No special equipment is needed to start. Your smartphone camera is sufficient for creating quality content. Focus on good lighting (natural light works great) and clear audio rather than expensive equipment.',
			},
		],
	},
	'video-recording': {
		questions: [
			{
				q: 'What are the best recording practices?',
				a: 'Record in good lighting, preferably natural light. Hold your phone steady or use a tripod. Record in vertical format for the best viewing experience. Make sure your audio is clear and not too quiet or loud.',
			},
			{
				q: 'How do I improve video quality?',
				a: "Clean your camera lens before recording, ensure good lighting, and avoid recording in noisy environments. Use the app's built-in stabilization features and consider the rule of thirds for better composition.",
			},
			{
				q: 'Can I record longer videos?',
				a: 'Yes, you can record videos up to 10 minutes long. However, shorter videos (15-60 seconds) often perform better as they maintain viewer attention and are more likely to be watched completely.',
			},
		],
	},
	hashtags: {
		questions: [
			{
				q: 'How do hashtags work?',
				a: 'Hashtags help categorize your content and make it discoverable to users interested in specific topics. Use relevant hashtags that describe your content, location, or trending topics.',
			},
			{
				q: 'How many hashtags should I use?',
				a: 'Use 3-5 relevant hashtags per video. Too many hashtags can look spammy, while too few might limit your reach. Focus on quality over quantity and choose hashtags that truly relate to your content.',
			},
			{
				q: 'Should I create my own hashtags?',
				a: 'You can create branded hashtags for your content or campaigns, but also use popular existing hashtags to increase discoverability. Mix trending hashtags with niche ones for the best results.',
			},
		],
	},
	'community-guidelines': {
		questions: [
			{
				q: 'What content is not allowed?',
				a: 'Content that promotes violence, hate speech, harassment, nudity, dangerous activities, or illegal substances is not allowed. Always create content that is respectful and safe for all users.',
			},
			{
				q: 'What happens if I violate guidelines?',
				a: 'Violations can result in content removal, account restrictions, or permanent bans depending on the severity. Always review the community guidelines before posting to ensure your content complies.',
			},
			{
				q: 'How do I report inappropriate content?',
				a: "Tap and hold on any video, then select 'Report'. Choose the appropriate reason for reporting and provide additional details if necessary. The moderation team will review your report.",
			},
		],
	},
};

export function GuidesTab() {
	const [selectedGuide, setSelectedGuide] =
		React.useState<string>('account-setup');
	const [expandedSections, setExpandedSections] = React.useState<string[]>([
		'getting-started',
	]);

	const toggleSection = (sectionId: string) => {
		setExpandedSections((prev) =>
			prev.includes(sectionId)
				? prev.filter((id) => id !== sectionId)
				: [...prev, sectionId],
		);
	};

	const handleGuideSelect = (guideId: string) => {
		setSelectedGuide(guideId);
	};

	const selectedContent = guideContent[selectedGuide];
	const selectedGuideInfo = guideStructure
		.flatMap((section) => section.items)
		.find((item) => item.id === selectedGuide);

	return (
		<div className="flex h-full">
			{/* Nested Sidebar */}
			<div className="w-80 border-r bg-sidebar">
				<div className="p-4">
					<h2 className="text-lg font-semibold mb-2">App Guides</h2>
					<p className="text-sm text-muted-foreground">
						Get the best out of Dhaaga
					</p>
				</div>
				{guideStructure.map((section) => (
					<Collapsible
						key={section.id}
						open={expandedSections.includes(section.id)}
						onOpenChange={() => toggleSection(section.id)}
					>
						<SidebarGroup>
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-accent/50 rounded-md p-2">
									<div className="flex items-center gap-2">
										<section.icon className="h-4 w-4" />
										<span>{section.title}</span>
									</div>
									<ChevronRight
										className={`h-4 w-4 transition-transform ${
											expandedSections.includes(section.id) ? 'rotate-90' : ''
										}`}
									/>
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu>
										{section.items.map((item) => (
											<SidebarMenuItem key={item.id}>
												<SidebarMenuButton
													isActive={selectedGuide === item.id}
													onClick={() => handleGuideSelect(item.id)}
													className="w-full justify-start"
												>
													<span>{item.title}</span>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				))}
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-auto">
				<div className="p-6">
					{selectedContent ? (
						<div className="max-w-4xl">
							<div className="mb-6">
								<div className="flex items-center gap-2 mb-2">
									<Badge variant="secondary">Guide</Badge>
									<h1 className="text-2xl font-bold">
										{selectedGuideInfo?.title}
									</h1>
								</div>
								<p className="text-muted-foreground">
									Frequently asked questions and detailed answers to help you
									get started.
								</p>
							</div>

							<div className="space-y-4">
								{selectedContent.questions.map((item, index) => (
									<Card key={index} className={'gap-4'}>
										<CardHeader>
											<CardTitle className="text-lg flex items-start gap-2 align-middle">
												<p>{item.q}</p>
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground leading-relaxed">
												{item.a}
											</p>
										</CardContent>
									</Card>
								))}
							</div>

							<div className="mt-8 p-4 bg-muted/50 rounded-lg">
								<h3 className="font-semibold mb-2">Need more help?</h3>
								<p className="text-sm text-muted-foreground">
									Can't find what you're looking for? You can ping me on discord
									or one of the project's social handles. I'll be happy to
									assist.
								</p>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<h3 className="text-lg font-semibold mb-2">Select a Guide</h3>
								<p className="text-muted-foreground">
									Choose a topic from the sidebar to view detailed guides and
									FAQs.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
