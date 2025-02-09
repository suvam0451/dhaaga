import { z } from 'zod';
// @ts-ignore
import { GiphyFetch } from '@giphy/js-fetch-api';

const postBodySchema = z.object({
	op: z.enum(['search']),
	q: z.string(),
	// suvam.io uses a mini puzzle to prevent spam
	puzzle: z.object({}).optional(),
});

// function to call the trending and category endpoints
async function searchGifs(q: string) {
	const gf = new GiphyFetch(process.env.SUVAMIO_GIPHY_API_KEY!);

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
