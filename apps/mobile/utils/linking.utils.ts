import * as Linking from 'expo-linking';

export class LinkingUtils {
	static openURL(url: string) {
		try {
			Linking.openURL(url).then((success) => {
				if (!success) {
					console.log('[WARN]: url linking reported failure by device');
				}
			});
		} catch (e) {
			console.log('[WARN]: could not open link externally');
		}
	}

	static openCoffeeLink() {
		LinkingUtils.openURL('https://buymeacoffee.com/suvam');
	}
}
