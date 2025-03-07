import { expect, test } from 'bun:test';
import { PostMentionObjectType, PostResolver } from '../../src';

const mentionTestData: PostMentionObjectType[] = [
	// mastoAPI
	{
		acct: 'foo',
		id: '123',
		url: 'https://mastodon.social/@foo',
		username: 'foo',
	},
	{
		acct: 'foo@bar.com',
		id: '123',
		url: 'https://bar.com/profile/foo',
		username: 'foo',
	},
];

// {"use": "webfinger", "webfinger": {"host": null, "username": "mattie"}}

// @mattie

test('list of mentions always resolves to valid lookup object', () => {
	for (const mention of mentionTestData) {
		expect(
			PostResolver.mentionItemsToWebfinger('@foo', [mention]),
		).toStrictEqual({
			use: 'userId',
			userId: '123',
		});
	}
});
