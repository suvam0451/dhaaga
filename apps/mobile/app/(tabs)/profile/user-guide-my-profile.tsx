import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'What does this page do?',
			answers: [
				'You can access most of your SNS features related to your account or server from here.',
				'This is also where you can also access Dhaaga features like Social Hub and Collections.',
			],
		},
		{
			question: 'How can I switch accounts?',
			answers: ['Long press the 5th tab to switch accounts from anywhere.'],
		},
		{
			question: 'How can I edit my avatar, banner etc?',
			answers: [
				'Since Dhaaga is an SNS and chat app, it does not support some features.',
				'You would have to use the web interface (for now).',
			],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (My Profile)'}
			language={'en'}
		/>
	);
}

export default Page;
