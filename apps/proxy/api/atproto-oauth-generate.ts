// @ts-ignore
import { NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { ResponseUtil } from '../utils/api-response.utils.ts';
import { AtprotoUtils } from '../utils/atproto.utils.ts';

const postBodySchema = z.object({
	pds: z.string().optional(),
	handle: z.string(),
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

	const client = await AtprotoUtils.buildClient();

	const url: URL = await client.authorize(body.handle, {
		state: crypto.randomBytes(16).toString('hex'),
	});

	return new Response(
		JSON.stringify({
			success: true,
			data: {
				href: url.href,
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
