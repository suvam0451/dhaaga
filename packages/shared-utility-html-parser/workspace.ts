import { DefaultInstanceRouter } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/default/instance.js';

async function main() {
	const x = new DefaultInstanceRouter();
	const { data, error } = await x.getCustomEmojis('https://threads.net');
	console.log(data, error);
}

main();
