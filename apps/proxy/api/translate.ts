// @ts-ignore
import type { NextRequest } from 'next/server';
import { z } from 'zod';

const postBodySchema = z.object({
	items: z.array(
		z.object({
			uuid: z.string(),
			text: z.string(),
		}),
	),
	toLocale: z.string(),
	type: z.enum(['free', 'dedicated'] as const),
});

const authKey = process.env.SUVAMIO_DEEPL_PRO_API_KEY;

export async function GET(request: NextRequest) {
	const rawBody = await request.text();

	return new Response(
		JSON.stringify({
			success: true,
			request,
			ip: (request as any).ip,
			// result
			url: request.url,
			body: rawBody,
		}),
		{
			status: 200,
			headers: {
				'X-RateLimit-Limit': '30',
				'X-RateLimit-Remaining': '30',
				'X-RateLimit-Reset': '20',
			},
		},
	);
}

export async function POST(request: NextRequest) {
	const rawBody = await request.text();

	if (!rawBody)
		return new Response(
			JSON.stringify({
				success: false,
				errors: ['E_Body_Missing'],
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

	const { success, error, data } = postBodySchema.safeParse(
		JSON.parse(rawBody),
	);
	if (!success)
		return new Response(
			JSON.stringify({
				success: false,
				errors: error.errors,
			}),
			{
				status: 400,
				headers: {
					'X-RateLimit-Limit': '30',
					'X-RateLimit-Remaining': '30',
					'X-RateLimit-Reset': '20',
					'Content-Type': 'application/json',
				},
			},
		);

	const result = await fetch('https://api-free.deepl.com/v2/translate', {
		method: 'POST',
		headers: {
			Authorization: `DeepL-Auth-Key ${authKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			text: data.items.map((o) => o.text),
			target_lang: data.toLocale,
		}),
	});
	const _body = await result.text();

	return new Response(
		JSON.stringify({
			success: true,
			data: JSON.parse(_body)?.translations,
		}),
		{
			status: 200,
			headers: {
				'X-RateLimit-Limit': '30',
				'X-RateLimit-Remaining': '30',
				'X-RateLimit-Reset': '20',
				'Content-Type': 'application/json',
			},
		},
	);
}
