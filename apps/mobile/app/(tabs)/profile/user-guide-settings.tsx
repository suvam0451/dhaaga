import UserGuideContainer from '../../../components/containers/UserGuideContainer';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: [
				'From here, you can tweak various settings that affect' +
					' your experience throughout the app ' +
					'and extra goodie features offered by Dhaaga.',
			],
		},
		{
			question: 'Why are my server settings not imported?',
			answers: [
				'Dhaaga is a multi-protocol client supporting many SNS software.',
				'So, these settings have to be set-up locally.',
				'But, once done, they will then be applied to all your SNS accounts!',
			],
		},
		{
			question: 'How can I pay and unlock the "Pro" version?',
			answers: ['What is a... "Pro" version? Is it a bird ? 🤔'],
		},
		{
			question: 'For real though, How can I support you ?',
			answers: [
				'Wow, gee. Thanks 💛.',
				'I built this app and made it free and open-source because I want the community to enjoy a superior SNS experience' +
					"—One, which isn't restricted by platforms and protocols, and one that isn't bogged down by the same old social media anti-features.",
				"As an indie developer, I'd really appreciate your feedback, encouragement and support.",
				'So, feel free to drop by and say hi 👋:',
				'Hated it ? Tell me what I can improve!\nLiked it ? maybe share it with your friends!\nLoved it ? consider leaving a tip!',
			],
		},
	];

	return (
		<UserGuideContainer
			questionnaire={qa}
			label={'User Guide (Settings)'}
			language={'en'}
		/>
	);
}

export default Page;
