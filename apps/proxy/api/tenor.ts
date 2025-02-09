// @ts-ignore
import { NextRequest } from 'next/server';
import { z } from 'zod';

const postBodySchema = z.object({
	op: z.enum(['search']),
	q: z.string(),
	// suvam.io uses a mini puzzle to prevent spam
	puzzle: z.object({}).optional(),
});

// function to call the trending and category endpoints
async function searchGifs(q: string) {
	// set the apikey and limit
	const apikey = process.env.SUVAMIO_TENOR_API_KEY;
	const clientkey = 'suvam_io';
	const lmt = 8;

	// using default locale of en_US
	const search_url = await fetch(
		'https://tenor.googleapis.com/v2/search?q=' +
			q +
			'&key=' +
			apikey +
			'&client_key=' +
			clientkey +
			'&limit=' +
			lmt,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		},
	);
	return await search_url.json();
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

	const {
		success,
		error,
		data: body,
	} = postBodySchema.safeParse(JSON.parse(rawBody));
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

	const resp = await searchGifs(body.q);

	return new Response(
		JSON.stringify({
			success: true,
			results: resp,
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
