import OpenAI from 'openai';

export class OpenAiService {
	static async explain(input: string) {
		if (
			!process.env.EXPO_PUBLIC_OPENAI_API_KEY ||
			process.env.EXPO_PUBLIC_OPENAI_API_KEY === ''
		) {
			return (
				'The lite edition of Dhaaga does not support AI features.' +
				" Single tap the translation button to use your instance's" +
				' translation, instead (WIP).'
			);
		}
		try {
			const client = new OpenAI({
				apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
				dangerouslyAllowBrowser: true,
			});

			const response = await client.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content:
							'You will be given text content from a social media' +
							' post, and your task is to explain it in English.',
					},
					{
						role: 'user',
						content: input,
					},
				],
			});
			for (let i = 0; i < response?.choices.length; i++) {
				console.log(response?.choices[i].message);
			}
			return response?.choices[0].message.content;
		} catch (e) {
			console.log('error', e);
		}
	}
}
