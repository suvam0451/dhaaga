import Target from './activitypub';

test('return correct user handle', () => {
	const MY_DOMAIN = 'mastodon.social';
	const itemsA = ['https://mas.to/@foo'];

	for (const item of itemsA) {
		expect(Target.getHandle(item, MY_DOMAIN)).toBe('@foo@mas.to');
	}

	const itemsB = ['https://mastodon.social/@foo'];
	for (const item of itemsB) {
		expect(Target.getHandle(item, MY_DOMAIN)).toBe('@foo');
	}
});

test('handle bridged accounts correctly', () => {
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

test('instance software is detected accurately', () => {
	const instances = [
		'mastodon.social',
		'mas.to',
		'infosec.exchange',
		'misskey.io',
		'stereophonic.space',
		'post.ebin.club', // private
		'seafoam.space',
		'social.trom.tf',
		'calckey.world',
		'lemmy.world',
		'libre.video',
		'pixelfed.social',
		'transfem.social',
		'hcommons.social',
		'k.lapy.link',
		'misskey.m544.net',
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
		'firefish',
		'lemmy',
		'peertube',
		'pixelfed',
		'sharkey',
		'hometown',
		'cherrypick',
		'meisskey',
	];
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
