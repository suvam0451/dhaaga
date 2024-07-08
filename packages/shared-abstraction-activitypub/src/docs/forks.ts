/**
 * Motto: Encourage the thriving fediverse
 * developer community by highlighting
 * their forks to the world
 */
import { KNOWN_SOFTWARE } from '../adapters/_client/_router/instance.js';

type Documentation = {
	url: string;
	name: string;
	desc: {
		en?: string;
		jp?: string;
	};
};

const MISSKEY_TEMPLATE: Documentation = {
	url: 'https://misskey-hub.net/en/',
	name: 'Misskey',
	desc: {
		en:
			'Misskey is an open source, decentralized social media platform' +
			" that's free forever!",
		jp: 'Misskey（ミスキー）はオープンソースの分散型ソーシャルネットワーキングプラットフォームです。',
	},
};

const MASTODON_TEMPLATE: Documentation = {
	url: 'https://joinmastodon.org/',
	name: 'Mastodon',
	desc: {
		en: 'Your self-hosted, globally interconnected microblogging community',
		jp: '売り物ではないソーシャルネットワークサービス',
	},
};

const PLEROMA_TEMPLATE: Documentation = {
	url: 'https://pleroma.social/',
	name: 'Pleroma',
	desc: {
		en: 'Pleroma is an impressively lightweight fediverse server.',
	},
};

export const SoftwareDocs: Record<KNOWN_SOFTWARE, Documentation> = {
	[KNOWN_SOFTWARE.AKKOMA]: {
		url: 'https://akkoma.social/',
		name: 'Akkoma',
		desc: {
			en:
				'Akkoma is a faster-paced fork of Pleroma, tailor-made for and by a' +
				' small community of contributors.',
		},
	},
	[KNOWN_SOFTWARE.CHERRYPICK]: MISSKEY_TEMPLATE,
	[KNOWN_SOFTWARE.FRIENDICA]: {
		url: 'https://friendi.ca/',
		name: 'Friendica',
		desc: {
			en:
				'Friendica is a software to create a distributed social network.' +
				' It is focused on social networking.',
		},
	},

	[KNOWN_SOFTWARE.FIREFISH]: {
		url: 'https://joinfirefish.org/',
		name: 'Firefish',
		desc: {
			en:
				'\n' +
				'About\n' +
				'Forked from Misskey and made by a passionate team of developers,' +
				'Firefish is all about listening to its community and making people ' +
				'happy with great software.',
		},
	},

	[KNOWN_SOFTWARE.GOTOSOCIAL]: {
		url: 'https://gotosocial.org',
		name: 'GoToSocial',
		desc: {
			en:
				'GoToSocial is an ActivityPub social network server, written in Golang.\n' +
				'\n' +
				'GoToSocial provides a lightweight, customizable,' +
				' and' +
				' safety-focused entryway into the Fediverse.',
		},
	},

	[KNOWN_SOFTWARE.HOMETOWN]: {
		url: 'https://github.com/hometown-fork/hometown',
		name: 'Hometown',
		desc: {
			en: 'A supported fork of Mastodon that provides local posting and a wider range of content types.',
		},
	},
	[KNOWN_SOFTWARE.ICESHRIMP]: MISSKEY_TEMPLATE,

	[KNOWN_SOFTWARE.KMYBLUE]: MASTODON_TEMPLATE,
	[KNOWN_SOFTWARE.LEMMY]: {
		url: 'https://join-lemmy.org/',
		name: 'Lemmy',
		desc: {
			en: 'Lemmy is a link aggregator for the Fediverse',
		},
	},

	[KNOWN_SOFTWARE.MASTODON]: MASTODON_TEMPLATE,
	[KNOWN_SOFTWARE.MEISSKEY]: MISSKEY_TEMPLATE,
	[KNOWN_SOFTWARE.MISSKEY]: MISSKEY_TEMPLATE,

	[KNOWN_SOFTWARE.PEERTUBE]: {
		url: 'https://joinpeertube.org/',
		name: 'PeerTube',
		desc: {
			en:
				'PeerTube is a tool for sharing online videos.' +
				' PeerTube allows' +
				' you to create your own video platform, in complete independence.',
		},
	},
	[KNOWN_SOFTWARE.PIXELFED]: {
		url: 'https://joinpeertube.org/',
		name: 'Pixelfed',
		desc: {
			en:
				"A fresh take on photo sharing.' + ' Get inspired with beautiful" +
				' photos captured by people around the world.',
		},
	},
	[KNOWN_SOFTWARE.PLEROMA]: PLEROMA_TEMPLATE,
	[KNOWN_SOFTWARE.SHARKEY]: MISSKEY_TEMPLATE,

	[KNOWN_SOFTWARE.UNKNOWN]: {
		url: 'N/A',
		name: 'N/A',
		desc: {},
	},
};

/**
 * the descriptions for these forks is
 * swapped with parent software docs,
 * in consideration of privacy
 * of their small userbase.
 *
 * Dhaaga will still try to cater
 * to any unique/interesting modifications
 * these forks make
 *
 * Admins, HMU, if you would like to be highlighted
 */
export const SoftwareDocsHidden: Partial<
	Record<KNOWN_SOFTWARE, Documentation>
> = {
	[KNOWN_SOFTWARE.CHERRYPICK]: {
		url: 'https://github.com/kokonect-link/cherrypick',
		name: 'CherryPick',
		desc: {
			en: 'CherryPick is a fork of misskey',
		},
	},
	[KNOWN_SOFTWARE.ICESHRIMP]: {
		url: 'https://iceshrimp.dev/iceshrimp/iceshrimp',
		name: 'IceShrimp',
		desc: {
			en: 'IceShrimp is a fork off misskey',
		},
	},
	[KNOWN_SOFTWARE.KMYBLUE]: {
		url: 'https://kmy.blue',
		name: 'Kmyblue',
		desc: {
			en:
				'kmyblue (pronounced "kamībūru") aims to provide a place where' +
				' discussions about doujinshi can freely take place.',
			jp: 'kmyblue（かみーぶるー）は、同人の話が自由にできる場所を目指します。',
		},
	},
	[KNOWN_SOFTWARE.MEISSKEY]: {
		url: 'https://github.com/mei23/misskey',
		name: 'Meisskey',
		desc: {
			en: "GET MEI-MEI'ed !!!",
			jp: 'お淑やかなめいめいさん推しのためのめいめい邸ガレージなのだわ. お淑やかなめいめいさん (@mei23) の言うことを聞くこと.',
		},
	},
	[KNOWN_SOFTWARE.SHARKEY]: {
		url: 'https://docs.joinsharkey.org/',
		name: 'Sharkey',
		desc: {
			en:
				'Sharkey is a Misskey fork following upstream changes when' +
				' possible, with added features.',
		},
	},
};
