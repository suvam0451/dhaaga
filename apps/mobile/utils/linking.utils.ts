import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';
import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	AtprotoUtils,
} from '@dhaaga/bridge';

export class LinkingUtils {
	static async saveToClipboard(content: string) {
		await Clipboard.setStringAsync(content);
	}

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

	static async openAtProtoFeed(client: ApiTargetInterface, uri: string) {
		try {
			const url = await AtprotoUtils.generateFeedUrl(
				client as AtprotoApiAdapter,
				uri,
			);
			LinkingUtils.openURL(url);
		} catch (e: any) {
			console.log(e);
		}
	}

	static openBluesky() {
		LinkingUtils.openURL('https://bsky.app/');
	}

	static openJoinMastodonHomepage() {
		LinkingUtils.openURL('https://joinmastodon.org/servers');
	}

	static openCoffeeLink() {
		LinkingUtils.openURL('https://buymeacoffee.com/suvam');
	}

	static openDiscordLink() {
		LinkingUtils.openURL('https://discord.gg/kMp5JA9jwD');
	}

	static openGithubLink() {
		LinkingUtils.openURL('https://github.com/suvam0451/dhaaga');
	}

	static openProjectWebsite() {
		LinkingUtils.openURL('https://suvam.io/dhaaga');
	}

	static shareAppLinkWithFriends() {
		Share.share(
			{
				message: 'https://suvam.io/dhaaga',
				url: 'https://suvam.io/dhaaga',
				title: 'Share the app with your friends!',
			},
			{
				dialogTitle: 'Share the app with your friends!',
			},
		).catch((e) => {
			console.log('[WARN]: could not share app with your friends!');
		});
	}

	static shareImageWithFriends(imageUrl: string) {
		Share.share({
			url: imageUrl,
			message: imageUrl,
			title: 'Share this image with your friends',
		});
	}
}
