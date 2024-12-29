import { createContext, useContext } from 'react';
import { Asset, useAssets } from 'expo-asset';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';

type Type = {
	branding: Asset[];
	isAssetsLoaded: boolean;
	getBrandLogo: (input: string) => {
		imgUrl: string;
		width: number;
		height: number;
	};
};

const defaultValue: Type = {
	branding: [],
	isAssetsLoaded: false,
	getBrandLogo: function (input: string): {
		imgUrl: string;
		width: number;
		height: number;
	} {
		throw new Error('Function not implemented.');
	},
};

const AppAssetsContext = createContext<Type>(defaultValue);

/**
 * Make sure to check that the assets are loaded
 * with a null check
 *
 * This thing fails without an error, dafuq?
 */
export function useAppAssetsContext() {
	return useContext(AppAssetsContext);
}

type Props = {
	children: any;
};

function WithAppAssetsContext({ children }: Props) {
	const [assets, error] = useAssets([
		require('../../assets/branding/akomma/logo.png'), // 0
		require('../../assets/branding/firefish/logo.png'), // 1
		require('../../assets/branding/mastodon/logo.png'), // 2
		require('../../assets/branding/misskey/logo.png'), // 3
		require('../../assets/branding/pleroma/logo.png'), // 4
		require('../../assets/branding/iceshrimp/logo.png'), // 5
		require('../../assets/branding/gotosocial/logo.png'), // 6
		require('../../assets/branding/sharkey/logo.png'), // 7
		require('../../assets/branding/peertube/logo.png'), // 8
		require('../../assets/branding/pixelfed/logo.png'), // 9
		require('../../assets/branding/cherrypick/logo.png'), // 10
		require('../../assets/branding/friendica/logo.png'), // 11
		require('../../assets/branding/lemmy/logo.png'), // 12
		require('../../assets/branding/kmyblue/logo.png'), // 13
		require('../../assets/branding/fedi/logo.png'), // 14
		require('../../assets/branding/bluesky/logo.png'), // 15
	]);

	const IsAssetsLoaded = !error && assets?.every((o) => o?.downloaded);

	function getBrandLogo(input: string) {
		switch (input.toLowerCase() as KNOWN_SOFTWARE) {
			case KNOWN_SOFTWARE.AKKOMA:
				return { imgUrl: assets[0].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.FIREFISH:
				return { imgUrl: assets[1].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.HOMETOWN:
			case KNOWN_SOFTWARE.MASTODON:
				return { imgUrl: assets[2].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.MEISSKEY:
			case KNOWN_SOFTWARE.MISSKEY:
				return { imgUrl: assets[3].localUri, width: 32, height: 24 };
			case KNOWN_SOFTWARE.PLEROMA:
				return { imgUrl: assets[4].localUri, width: 14, height: 24 };
			case KNOWN_SOFTWARE.ICESHRIMP:
				return { imgUrl: assets[5].localUri, width: 24, height: 24 };
			case KNOWN_SOFTWARE.GOTOSOCIAL:
				return {
					imgUrl: assets[6].localUri,
					width: 28,
					height: 24,
				};
			case KNOWN_SOFTWARE.SHARKEY: {
				return {
					imgUrl: assets[7].localUri,
					width: 28,
					height: 24,
				};
			}
			case KNOWN_SOFTWARE.PEERTUBE: {
				return {
					imgUrl: assets[8].localUri,
					width: 20,
					height: 24,
				};
			}
			case KNOWN_SOFTWARE.PIXELFED: {
				return { imgUrl: assets[9].localUri, width: 24, height: 24 };
			}
			case KNOWN_SOFTWARE.CHERRYPICK: {
				return { imgUrl: assets[10].localUri, width: 148, height: 24 };
			}
			case KNOWN_SOFTWARE.FRIENDICA: {
				return { imgUrl: assets[11].localUri, width: 24, height: 24 };
			}
			case KNOWN_SOFTWARE.LEMMY: {
				return { imgUrl: assets[12].localUri, width: 24, height: 24 };
			}
			// hometown is clubbed with mastodon
			// meisskey is clubbed with misskey
			case KNOWN_SOFTWARE.KMYBLUE: {
				return { imgUrl: assets[13].localUri, width: 24, height: 24 };
			}

			case KNOWN_SOFTWARE.UNKNOWN:
			default:
				return { imgUrl: assets[14].localUri, width: 24, height: 24 };
		}
	}

	return (
		<AppAssetsContext.Provider
			value={{
				branding: assets,
				isAssetsLoaded: IsAssetsLoaded,
				getBrandLogo,
			}}
		>
			{children}
		</AppAssetsContext.Provider>
	);
}

export default WithAppAssetsContext;
