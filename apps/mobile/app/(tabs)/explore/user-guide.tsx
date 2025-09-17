import GuideFactory from '../../../features/guides/components/GuideFactory';

function Page() {
	const qa: { question: string; answers: string[] }[] = [
		{
			question: 'What does this page do?',
			answers: [
				'This page lets you compose posts.',
				'In the future, you will also be able to create polls and track your published content.',
			],
		},
		{
			question: 'Why so many layouts?',
			answers: [
				'Dhaaga has three unique composer layouts! Phew!',
				'The smallest one appears when replying to direct messages and posts. Quick and easy!',
				'The medium sized one (a.k.a. - \"Quick Post\") appears when publishing original posts. It has most options, but a bit cramped for longer posts.',
				'The full sized composer (not implemented yet) will have every option to express your creativity!',
			],
		},
		{
			question: 'How to configure default layouts?',
			answers: [
				'Mini layouts can get cramped, I know! But, please advise on how they can be improved, instead of replacing them.',
				'If you must, then future updates will include options to force larger layouts.',
			],
		},
		{
			question: 'Why are some options grayed out?',
			answers: [
				'They are either implemented yet, or your server does not support them yet.',
			],
		},
		{
			question: 'One more thing...',
			answers: [
				'You can switch from the mini layout to "Quick Post" anytime, by pressing the button on the left.',
			],
		},
	];

	return <GuideFactory questionnaire={qa} label={'Guide (Composer)'} />;
}

export default Page;
