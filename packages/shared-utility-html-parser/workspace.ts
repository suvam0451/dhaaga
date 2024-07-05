import ActivitypubHelper from './src/activitypub';

async function main() {
	const data = ActivitypubHelper.getHandle(
		'https://web.brid.gy/r/https://www.animenewsnetwork.com/',
		'https://mastodon.social',
	);
	console.log(data);
}

main();
