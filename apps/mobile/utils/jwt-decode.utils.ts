import { Result } from './result';

/**
 * alternative for the jwt-decode library
 * @param token the jwt token
 */
export function jwtDecode(token: string): Result<Object> {
	if (!token) return { type: 'error', error: new Error('No token provided') };

	const parts = token.split('.');
	if (parts.length !== 3) {
		return { type: 'error', error: new Error('Invalid token format') };
	}

	try {
		const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
		const parsed = JSON.parse(payload);
		return { type: 'success', value: parsed };
	} catch (error) {
		return { type: 'error', error: new Error('Failed to decode token') };
	}
}
