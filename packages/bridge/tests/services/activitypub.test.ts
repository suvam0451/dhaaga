import { describe, test, expect } from 'bun:test';
import ActivitypubHelper from '../../src/services/activitypub.js';

describe('sample test', () => {
	test('removes url prefixes properly', () => {
		const result = ActivitypubHelper.removeURLPrefixes('https://example.com');
		expect(result).toBe('example.com');
	});
});
