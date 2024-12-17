import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'What does this page do?',
			answers: [
				'This "Social Hub" interface is a homepage customization experience unique to Dhaaga.',
				'You can pin your favourite timelines, servers, hashtags and users here.',
				'It can be customized for each \"Profile\" separately.',
			],
		},

		{
			question: 'What are profiles?',
			answers: [
				'Dhaaga lets you create multiple profiles for each "account" (WIP 🚧)',
				'Each profile can have separate social hub layout and certain settings.',
				'Each account always has a \"Default\" profile.',
			],
		},
		{
			question: 'Where are my timelines?',
			answers: ['They are under the "Pinned" section.'],
		},
		{
			question: 'What is the Bookmark Gallery?',
			answers: [
				'It is a feature unique to Dhaaga.',
				'It lets you fetch and view your bookmarks offline (Bluesky, as well 😉).',
			],
		},
		{
			question: 'What is the "For You" section?',
			answers: [
				'It lets you access complementary features like themes, release notes etc.',
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
