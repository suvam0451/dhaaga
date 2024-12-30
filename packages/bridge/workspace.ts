import { DefaultInstanceRouter } from './src/adapters/_client/default/instance.js';

async function main() {
	const y = new DefaultInstanceRouter();
	const { data: dataA, error: errorA } = await y.getCustomEmojis(
		'press.anyaforger.art',
	);
	if (!errorA) {
		console.log(dataA.length);
	} else {
		console.log(errorA);
	}
}

main();
