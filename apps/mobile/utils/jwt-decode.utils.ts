/**
 * alternative for the jwt-decode library
 * @param token the jwt token
 */
export function jwtDecode(token: string): Object {
	if (!token) throw new Error('No token provided');

	const parts = token.split('.');
	if (parts.length !== 3) throw new Error('Invalid token format');

	try {
		const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
		return JSON.parse(payload);
	} catch (error) {
		throw new Error('Failed to decode token');
	}
}
