import { PleromaInstanceRouter } from './src/adapters/_client/pleroma/instance.js';
import { DefaultInstanceRouter } from './src/adapters/_client/default/instance.js';
import ActivitypubHelper from './src/services/activitypub';

async function main() {
	const y = new DefaultInstanceRouter();
	// scg.owu.one
	const { data: dataA, error: errorA } = await y.getCustomEmojis(
		'press.anyaforger.art',
	);
	if (!errorA) {
		console.log(dataA.length);
	} else {
		console.log(errorA);
	}

	// ActivitypubHelper.getHandle()
}

main();
