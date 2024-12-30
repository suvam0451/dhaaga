import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useAppAssetsContext } from './useAssets';

function useKnownSoftware(software: string) {
	const { branding } = useAppAssetsContext();

	if (!branding)
		return {
			bg: '#8ae805',
			fg: 'white',
			label: 'Loading',
			width: 24,
			height: 24,
		};

	switch (software as KNOWN_SOFTWARE) {
		case KNOWN_SOFTWARE.BLUESKY: {
			return {
				bg: '#8ae805',
				fg: 'white',
				label: 'Bluesky',
				logo: branding[15],
				width: 28,
				height: 28,
			};
		}
		case KNOWN_SOFTWARE.MISSKEY:
			return {
				bg: '#8ae805',
				fg: 'white',
				label: 'Misskey',
				logo: branding[3],
				width: 24,
				height: 24,
			};
		case KNOWN_SOFTWARE.FIREFISH: {
			return {
				bg: '#f17c5b',
				fg: 'white',
				label: 'Firefish',
				logo: branding[1],
				width: 24,
				height: 24,
			};
		}
		case KNOWN_SOFTWARE.MASTODON: {
			return {
				bg: '#6365fe',
				fg: 'white',
				label: 'Mastodon',
				logo: branding[2],
				width: 20,
				height: 20,
			};
		}
		case KNOWN_SOFTWARE.SHARKEY: {
			return {
				bg: '#6365fe',
				fg: 'white',
				label: 'Sharkey',
				logo: branding[7],
				width: 24,
				height: 20,
			};
		}
		case KNOWN_SOFTWARE.PLEROMA: {
			return {
				bg: '#df8958',
				fg: '#e9e7e4',
				label: 'Pleroma',
				logo: branding[4],
				width: 12,
				height: 20,
			};
		}
		case KNOWN_SOFTWARE.AKKOMA: {
			return {
				bg: '#df8958',
				fg: '#e9e7e4',
				label: 'Akkoma',
				logo: branding[0],
				width: 20,
				height: 20,
			};
		}
		case KNOWN_SOFTWARE.GOTOSOCIAL: {
			return {
				bg: '#df8958',
				fg: '#e9e7e4',
				label: 'GoToSocial',
				logo: branding[6],
				width: 24,
				height: 24,
			};
		}
		default:
			return {
				bg: 'gray',
				label: 'Unknown',
				width: 24,
				height: 24,
				logo: branding[6],
			};
	}
}

export default useKnownSoftware;
