import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import {
	AtprotoApiAdapter,
	AtprotoUtils,
	BaseUrlNormalizationService,
	DriverService,
	ApiTargetInterface,
} from '@dhaaga/bridge';
import type { PostTimelineStateType } from '@dhaaga/core';

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

	private static async _generateFeedUrl(
		client: ApiTargetInterface,
		state: PostTimelineStateType,
	): Promise<string> {
		const server = `${BaseUrlNormalizationService.appendHttps(client.server)}`;
		switch (state.feedType) {
			case 'Feed': {
				return AtprotoUtils.generateFeedUrl(
					client as AtprotoApiAdapter,
					state.query.id,
				);
			}
			case 'Home': {
				return `${server}/home`;
			}
			case 'Local': {
				return `${server}/public/local`;
			}
			case 'Federated':
				return `${server}/public`;
			case 'User': {
				if (DriverService.supportsMastoApiV1(client.driver)) {
					// TODO: resolve handle for mastodon
				} else {
					return `${server}/${state.query.id}`;
				}
			}
		}
	}

	static async openFeedInBrowser(
		client: ApiTargetInterface,
		state: PostTimelineStateType,
	) {
		try {
			const url = await LinkingUtils._generateFeedUrl(client, state);
			LinkingUtils.openURL(url);
		} catch (e) {
			console.log(e);
		}
	}

	static async shareFeed(
		client: ApiTargetInterface,
		state: PostTimelineStateType,
	) {
		try {
			const url = await LinkingUtils._generateFeedUrl(client, state);
			if (Sharing.isAvailableAsync()) {
				// Sharing.shareAsync(url, {
				// 	dialogTitle: 'Share this timeline with your friends!',
				// });
				await Share.share({
					message: url,
					url, // iOS uses this field
					title: 'Share this timeline with your friends!',
				});
			} else {
				console.log('[WARN]: sharing not available on this device');
			}
			// LinkingUtils.openURL(url);
		} catch (e) {
			console.log(e);
		}
	}
}
