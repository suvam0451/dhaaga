import GuideFactory from '../../../features/guides/components/GuideFactory';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where is this?',
			answers: [
				'This is the discovery portal of Dhaaga.',
				'It is just a search and history tab for now 😅.',
				'But, more fun ways to find friends and communities will be added in the future.',
			],
		},
		{
			question: 'How do I go back to the beginning?',
			answers: ['Simply open the search widget and clear (x) the search text.'],
		},
		{
			question: 'How can I customise this page?',
			answers: [
				'As more modules get added, you will be able to add and organise their order',
			],
		},
		{
			question: 'Why are some of my radio buttons disabled?',
			answers: [
				'Because your server does not support it.',
				'For example, Bluesky does not support search for posts, and only Mastodon has links implemented.',
			],
		},
		{
			question: 'Where are my trending tabs?',
			answers: [
				'Dhaaga hides news and trending topics, by default.',
				'You can add and customise any extra modules, as needed.',
				'[NOTE]: There are no extra modules introduced as of v0.11.0',
			],
		},
	];

	return <GuideFactory questionnaire={qa} label={'User Guide (Discover)'} />;
}

export default Page;
