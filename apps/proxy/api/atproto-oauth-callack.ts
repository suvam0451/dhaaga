// @ts-ignore
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ResponseUtil } from '../utils/api-response.utils.ts';
import { AtprotoUtils } from '../utils/atproto.utils.ts';

const postBodySchema = z.object({
	callbackUrl: z.string(),
});

export async function POST(request: NextRequest) {
	const rawBody = await request.text();
	if (!rawBody) return ResponseUtil.badRequest_bodyMissing();

	const {
		success,
		error,
		data: body,
	} = postBodySchema.safeParse(JSON.parse(rawBody));
	if (!success) return ResponseUtil.badRequest_invalidInput(error.errors);

	const params = new URLSearchParams(body.callbackUrl.split('?')[1]);

	const client = await AtprotoUtils.buildClient();
	const { session, state } = await client.callback(params);

	return new Response(
		JSON.stringify({
			success: true,
			data: {
				session,
				state,
			},
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
}
