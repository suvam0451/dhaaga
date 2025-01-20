import GuideFactory from '../../../features/guides/components/GuideFactory';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'Where am I?',
			answers: ["This page let's you create new posts."],
		},
		{
			question: 'What is Quick Post?',
			answers: [
				"It is a unique Dhaaga feature that let's you quickly create/reply to posts",
				'The downsides are the limited space and minimal options.',
				'You can disable this and switch to the full sized composer for everything.',
			],
		},
		{
			question: 'Why are some options grayed out?',
			answers: [
				'They are not implemented yet.',
				'The placeholder is to indicate that it is planned.',
			],
		},
	];

	return <GuideFactory questionnaire={qa} label={'User Guide (Composer)'} />;
}

export default Page;
