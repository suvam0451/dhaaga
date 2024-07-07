import { PleromaInstanceRouter } from './src/adapters/_client/pleroma/instance.js';

async function main() {
	const z = null as any;

	const y = new PleromaInstanceRouter(z);
	const { data: dataA, error: errorA } =
		await y.getCustomEmojis('https://misskey.io');
	if (!errorA) {
		console.log(dataA.length);
	}
}

main();
