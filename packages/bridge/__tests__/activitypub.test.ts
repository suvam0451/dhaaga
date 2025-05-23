import { describe, expect, test } from 'bun:test';
import Target from '../src/services/activitypub';

test('return correct user handle', () => {
	const MY_DOMAIN = 'mastodon.social';
	const itemsA = ['https://mas.to/@foo', 'https://fedi.pleroma.be/users/foo'];
	const resA = ['@foo@mas.to', '@foo@fedi.pleroma.be'];

	let count = 0;
	for (const item of itemsA) {
		expect(Target.getHandle(item, MY_DOMAIN)).toBe(resA[count]);
		count++;
	}

	const itemsB = ['https://mastodon.social/@foo'];
	for (const item of itemsB) {
		expect(Target.getHandle(item, MY_DOMAIN)).toBe('@foo');
	}
});

test('correctly handle bridged accounts', () => {
	const MY_DOMAIN = 'mastodon.social';
	const itemsA = [
		'https://web.brid.gy/r/https://www.animenewsnetwork.com',
		'https://web.brid.gy/r/https://www.animenewsnetwork.com/',
	];

	for (const item of itemsA) {
		expect(Target.getHandle(item, MY_DOMAIN)).toBe(
			'animenewsnetwork.com (via web.brid.gy)',
		);
	}
});

test('threads specific stuff', () => {
	expect(
		Promise.resolve(
			Target.getInstanceSoftwareByHandle(
				`https://www.threads.net/@foo`,
				'mastodon.social',
			),
		),
	).resolves.toHaveProperty('software', 'threads');
});

test('instance software is detected correctly for private (visibility) instances', () => {
	const instances = ['suya.place'];
	const software = ['akkoma'];

	let index = 0;
	for (const instance of instances) {
		expect(
			Promise.resolve(
				Target.getInstanceSoftwareByHandle(
					`@foo@${instance}`,
					'mastodon.social',
				),
			),
		).resolves.toHaveProperty('software', software[index]);
		index++;
	}
});

describe('detect instance software', () => {
	const instances = [
		'mastodon.social',
		'mas.to',
		'infosec.exchange',
		'misskey.io',
		'stereophonic.space',
		'post.ebin.club', // private
		'seafoam.space', // ded
		'social.trom.tf',
		'lemmy.world',
		'libre.video',
		'pixelfed.social',
		'transfem.social',
		'hcommons.social',
		'k.lapy.link',
		'misskey.m544.net',
		'misskey.cloud',
	];
	const software = [
		'mastodon',
		'mastodon',
		'mastodon',
		'misskey',
		'pleroma',
		'pleroma',
		'akkoma',
		'friendica',
		'lemmy',
		'peertube',
		'pixelfed',
		'sharkey',
		'hometown',
		'cherrypick',
		'meisskey',
		'misskey',
	];
	for (let i = 0; i < instances.length; i++) {
		test(`return correct software driver for ${instances[i]}`, () => {
			expect(
				Promise.resolve(
					Target.getInstanceSoftwareByHandle(
						`@foo@${instances[i]}`,
						'mastodon.social',
					),
				),
			).resolves.toHaveProperty('software', software[i]);
		});
	}
});

/**
 * Ad test for GoToSocial emojis
 * endpoint failing with token
 * requirements
 */
