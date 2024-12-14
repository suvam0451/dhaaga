import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: [
				'This "Social Hub" id a unique homepage experience offered by Dhaaga.',
				'It utilises the superior profile and pinning system implemented (WIP) in Dhaaga',
			],
		},

		{
			question: 'What are profiles?',
			answers: [
				'Dhaaga lets you create multiple profiles per "account" (WIP 🚧)',
				'You can have customise your social hub experience (e.g. - different pins) per profile.',
			],
		},
		{
			question: 'Where are my timelines?',
			answers: ['They are under the "Pinned" section.'],
		},
		{
			question: 'What is the Bookmark Gallery?',
			answers: [
				'It is a Dhaaga feature. Yes, even for Bluesky.',
				'It lets you download and view your bookmarked posts offline. Also, the UI/UX is pretty neat.',
			],
		},
		{
			question: 'What does the "For You" section do?',
			answers: [
				'No worries. It is not an algorithmic feed. We don\"t do that here.',
				'It lets you access non-essential features like app theming, release notes and other complementary features.',
			],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (Home)'}
			language={'en'}
		/>
	);
}

export default Page;
