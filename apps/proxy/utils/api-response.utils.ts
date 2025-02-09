import { z } from 'zod';

export class ResponseUtil {
	static badRequest_bodyMissing() {
		return new Response(JSON.stringify({
			success: false,
			errors: ['E_Body_Missing']
		}), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	static badRequest_invalidInput(errors: z.ZodIssue[]) {
		return new Response(JSON.stringify({
			success: false,
			errors: errors
		}), {
			status: 400,
			headers: {
				'X-RateLimit-Limit': '30',
				'X-RateLimit-Remaining': '30',
				'X-RateLimit-Reset': '20',
				'Content-Type': 'application/json'
			}
		});
	}

	static success(data: any) {
		new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'X-RateLimit-Limit': '30',
				'X-RateLimit-Remaining': '30',
				'X-RateLimit-Reset': '20',
				'Content-Type': 'application/json'
			}
		});
	}
}