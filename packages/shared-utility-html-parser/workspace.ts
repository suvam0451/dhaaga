import ActivitypubHelper from './src/activitypub';
import { DefaultInstanceRouter } from '@dhaaga/shared-abstraction-activitypub/src/adapters/_client/default/instance';

async function main() {
	// const data = ActivitypubHelper.getHandle(
	// 	'https://web.brid.gy/r/https://www.animenewsnetwork.com/',
	// 	'https://mastodon.social',
	// );
	// console.log(data);

	const x = new DefaultInstanceRouter();
	const { data, error } = await x.getCustomEmojis('https://oshiri.space');
	// const { data, error } = await x.getCustomEmojis('https://misskey.io');
	console.log(data, error);
}

main();
