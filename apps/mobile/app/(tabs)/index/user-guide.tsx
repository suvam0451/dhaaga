import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'What is this page?',
			answers: [
				'The "Social Hub" interface is a homepage customization experience unique to Dhaaga app.',
				'It lets you organise pins and keep up across your accounts seamlessly.',
			],
		},

		{
			question: 'What are profiles?',
			answers: [
				'You can create multiple profiles for an account. ' +
					'Profiles only affect the hub layout.',
				'Think of them like folders to organise your interests!',
			],
		},
		{
			question: 'How do I remove a timeline?',
			answers: [
				'Not implemented as of v0.11.0 yet.',
				'Some timelines can only be hidden, never deleted. (e.g. - Home)',
			],
		},
		{
			question: 'Why am I shown a tiny lock icon?',
			answers: [
				'You can refresh and keep up to date with your accounts and profiles anytime.',
				'However, to jump to timelines and use other features of the app, you must switch to that account',
				'The app will prompt you to switch when needed, or you can switch yourself by long pressing the 5th tab in the navbar.',
			],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (Hub)'}
			language={'en'}
		/>
	);
}

export default Page;
