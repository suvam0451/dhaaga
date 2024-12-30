import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: [
				'This is the discovery portal of Dhaaga.',
				'It is just a search and history tab for now 😅.',
				'But, more fun ways to find friends and communities will be added in the future.',
			],
		},
		{
			question: 'How do I go back to the start?',
			answers: ['Press the Home button on the right side of the search bar.'],
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
				'By principle, Dhaaga does not push news and trending topics on you.',
				'This tab is dedicated to help you organically discover communities and shared interests.',
				'In a future update, you will be able to show/hide News and tending topics in your Social Hub.',
			],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (New Tab)'}
			language={'en'}
		/>
	);
}

export default Page;
