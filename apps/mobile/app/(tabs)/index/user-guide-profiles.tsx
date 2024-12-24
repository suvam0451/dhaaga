import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: [
				'This is the hub interface to add a new tab.',
				'Each tab in Dhaaga represents a profile.',
				'You can decorate your pins, apply themes and change certain' +
					' settings for each profile individually.',
			],
		},
		{
			question: 'What is a profile?',
			answers: [
				'E.g. - One for #sports and one for #art accounts.',
				'Swipe when your mood swings and pull to refresh. ',
				"It's that easy to keep up to date 😉",
			],
		},
		{
			question: 'Too many profiles to manage?',
			answers: [
				'A feature to *hide* profiles, when not needed, will be added in a future update.',
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
