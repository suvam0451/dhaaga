import { describe, expect, it } from 'bun:test';
import { BaseUrlNormalizationService } from '../../src/utils/urls';

describe('UrlNormalizationService', () => {
	describe('appendHttps', () => {
		it('adds https:// to domain without protocol and strips path/query/hash', async () => {
			const result = BaseUrlNormalizationService.appendHttps(
				'example.com/path?query=123#section',
			);
			expect(result).toBe('https://example.com');
		});

		it('keeps https:// if already present and strips extra parts', async () => {
			const result = BaseUrlNormalizationService.appendHttps(
				'https://example.com/foo/bar?x=1',
			);
			expect(result).toBe('https://example.com');
		});

		it('converts http:// to https:// and strips everything after base', async () => {
			const result = BaseUrlNormalizationService.appendHttps(
				'http://example.com/test',
			);
			expect(result).toBe('https://example.com');
		});

		it('handles URLs with ports', async () => {
			const result = BaseUrlNormalizationService.appendHttps(
				'http://localhost:3000/dashboard',
			);
			expect(result).toBe('https://localhost:3000');
		});

		it('throws error for invalid URL', async () => {
			expect(
				BaseUrlNormalizationService.appendHttps('::badurl'),
			).rejects.toThrow('Invalid URL');
		});
	});

	describe('stripHttps', () => {
		it('removes https:// and strips path/query/hash', async () => {
			const result = BaseUrlNormalizationService.stripHttps(
				'https://example.com/path/to/page',
			);
			expect(result).toBe('example.com');
		});

		it('removes http:// and returns base domain only', async () => {
			const result = BaseUrlNormalizationService.stripHttps(
				'http://example.com/foo?bar=baz',
			);
			expect(result).toBe('example.com');
		});

		it('works with URL without protocol', async () => {
			const result =
				BaseUrlNormalizationService.stripHttps('example.com/about');
			expect(result).toBe('example.com');
		});

		it('returns just hostname when subdomain is present', async () => {
			const result = BaseUrlNormalizationService.stripHttps(
				'https://blog.example.com/some-post',
			);
			expect(result).toBe('blog.example.com');
		});

		it('includes port if present', async () => {
			const result = BaseUrlNormalizationService.stripHttps(
				'http://localhost:8080/api',
			);
			expect(result).toBe('localhost:8080');
		});

		it('throws error for invalid URL', async () => {
			expect(BaseUrlNormalizationService.stripHttps('@@@')).rejects.toThrow(
				'Invalid URL',
			);
		});
	});
});
