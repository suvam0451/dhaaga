import { describe, expect, test } from 'bun:test';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { DriverService } from '../../src/services/driver.service';
import { data } from '../../src/data/drivers';

const keys = Object.keys(data) as KNOWN_SOFTWARE[];

describe('atproto support', () => {
	keys.forEach((key) => {
		test(`return correct compatibility for ${key}`, () => {
			const result = DriverService.supportsAtProto(key);
			expect(result).toBe(data[key].includes('atproto'));
		});
	});
});

describe('mastoAPI v1 support', () => {
	keys.forEach((key) => {
		test(`return correct compatibility for ${key}`, () => {
			const result = DriverService.supportsMastoApiV1(key);
			expect(result).toBe(data[key].includes('masto_api_v1'));
		});
	});
});

describe('mastoAPI v2 support', () => {
	keys.forEach((key) => {
		test(`return correct compatibility for ${key}`, () => {
			const result = DriverService.supportsMastoApiV2(key);
			expect(result).toBe(data[key].includes('masto_api_v2'));
		});
	});
});

describe('misskey api support', () => {
	keys.forEach((key) => {
		test(`return correct compatibility for ${key}`, () => {
			const result = DriverService.supportsMisskeyApi(key);
			expect(result).toBe(data[key].includes('misskey_api'));
		});
	});
});
