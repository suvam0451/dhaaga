import { HfInference } from '@huggingface/inference';

export class HuggingFaceService {
	private static async _infer(input: string, token: string) {
		const client = new HfInference(token);

		try {
			const chatCompletion = await client.chatCompletion({
				model: 'meta-llama/Llama-2-7b-chat-hf',
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

					{
						role: 'user',
						content: 'What is the capital of France?',
					},
				],
				max_tokens: 500,
			});
			console.log(chatCompletion.choices[0].message);
		} catch (e) {
			return null;
		}
	}
	static async inferServerless(input: string): Promise<string | null> {
		return this._infer(input, 'N/A');
	}

	static async inferDedicated(input: string): Promise<string | null> {
		return this._infer(input, 'N/A');
	}
}
