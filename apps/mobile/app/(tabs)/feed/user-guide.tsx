import GuidePageBuilder from '#/ui/GuidePageBuilder';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: [
				'This is the powerful timeline interface of Dhaaga.',
				'To switch timelines, click the little arrow beside the name ' +
					'of the current timeline to bring up the switcher interface.',
			],
		},
		{
			question: 'Can I have multiple timelines at once?',
			answers: [
				'Technically, you can have one timeline active ' +
					'in the first two tabs.',
				'But, Dhaaga is intended to view one timeline at a time.',
			],
		},
		{
			question: 'Why is the reply sheet smaller from the full-sized composer?',
			answers: [
				'It is designed for quick replies and chat.',
				'You can expand to use full-sized composer, if needed.',
			],
		},
		{
			question: 'How can I apply filters?',
			answers: [
				'By pressing the info button a top-right, if:',
				'1) Your server supports filters for this timeline.',
				'2) It has been implemented by Dhaaga.',
			],
		},
		{
			question: 'How can I change my timeline settings?',
			answers: [
				'A collection of "Quick Settings" can be toggled handily by pressing the info button.',
				'The full list of settings can be accessed from the Profile (5th) tab.',
			],
		},
	];

	return (
		<GuidePageBuilder questionnaire={qa} label={'User Guide (Timelines)'} />
	);
}

export default Page;
