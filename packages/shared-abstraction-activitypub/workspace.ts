// import { DefaultInstanceRouter } from '@dhaaga/shared-abstraction-activitypub/src/adapters/_client/default/instance';

import { DefaultInstanceRouter } from './src/adapters/_client/default/instance';
import { PleromaInstanceRouter } from './src/adapters/_client/pleroma/instance';
import { RestClient } from '@dhaaga/shared-provider-mastodon/src';

async function main() {
	// const data = ActivitypubHelper.getHandle(
	// 	'https://web.brid.gy/r/https://www.animenewsnetwork.com/',
	// 	'https://mastodon.social',
	// );
	// console.log(data);

	// const x = new DefaultInstanceRouter();
	// const { data, error } = await x.getCustomEmojis('https://mastodon.social');
	// const { data, error } = await x.getCustomEmojis('https://misskey.io');
	// console.log(data, error);

	// const z = new RestClient('', {
	// 	accessToken: '',
	// 	domain: 'https://misskey.io',
	// });

	const z = null as any;

	const y = new PleromaInstanceRouter(z);
	// const { data: dataA, error: errorA } =
	// 	await y.getCustomEmojis('https://misskey.io');
	const {
		data: dataA,
		error: errorA,
		statusCode,
	} = await y.getCustomEmojis('https://transfem.social');
	if (!errorA) {
		console.log(dataA.length);
	}
}

main();
