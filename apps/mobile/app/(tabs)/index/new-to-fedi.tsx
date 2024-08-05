import { Linking, ScrollView, StatusBar, StyleSheet, Text } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../styles/AppTheme';
import SimpleTutorialContainer from '../../../components/containers/SimpleTutorialContainer';
import { APP_FONTS } from '../../../styles/AppFonts';

// const styles = StyleSheet
function WhatIsFediverse() {
	const url = 'https://joinmastodon.org/';

	function openMastodonWithDefaultBrowser() {
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				Linking.openURL(url);
			} else {
				console.log("Don't know how to open URI: " + url);
			}
		});
	}

	const forksUrl = 'https://github.com/mastodon/mastodon/forks';

	function openMastodonForksWithDefaultBrowser() {
		Linking.canOpenURL(forksUrl).then((supported) => {
			if (supported) {
				Linking.openURL(forksUrl);
			} else {
				console.log("Don't know how to open URI: " + forksUrl);
			}
		});
	}

	return (
		<SimpleTutorialContainer title={'What is Mastodon?'}>
			<ScrollView
				style={{
					paddingHorizontal: 8,
					paddingTop: 16,
					marginBottom: 54,
					paddingBottom: 16,
				}}
			>
				<Text style={[styles.sectionHeaderText, { marginTop: 0 }]}>
					Overview
				</Text>
				<Text style={styles.para}>
					Mastodon is a decentralized social network. It is part of the larger
					Fediverse.
				</Text>
				<Text style={styles.para}>
					Unlike most traditional social media platforms, it is not owned (as
					in, hosted) by a single entity.
				</Text>
				<Text style={styles.para}>
					Instead, multiple independent servers (a.k.a. instances) communicate
					with each other. The protocol used for this is called{' '}
					<Text style={{ color: APP_THEME.LINK }}>ActivityPub</Text>.
				</Text>
				<Text style={styles.para}>
					^ Kind of similar to email. You can send an e-mail from gmail to
					icloud, for example, yeah?
				</Text>

				<Text style={styles.sectionHeaderText}>Interested In?</Text>

				<Text style={styles.para}>
					Go check out the{' '}
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_THEME.LINK,
						}}
						onPress={openMastodonWithDefaultBrowser}
					>
						official website
					</Text>{' '}
					to learn of features you may be interested in and instances you can
					join.
				</Text>

				<Text style={styles.para}>
					Even if the vision of Mastodon and/or federated social platforms do
					not resonate with you, it may still be worth your time to build a
					profile.
				</Text>

				<Text style={styles.para}>
					Having a good time online is all about the people you meet along the
					way, and not about which platform you are on, after all.
				</Text>

				<Text style={styles.sectionHeaderText}>One more thing</Text>
				<Text style={styles.para}>
					Mastodon is not the only type of user-facing service that communicates
					using ActivityPub. There are numerous other forks you can
					<Text
						onPress={openMastodonForksWithDefaultBrowser}
						style={{
							fontFamily: APP_FONTS.INTER_700_BOLD,
							color: APP_THEME.LINK,
						}}
					>
						{' '}
						check out
					</Text>
					.
				</Text>
			</ScrollView>
		</SimpleTutorialContainer>
	);
}

const styles = StyleSheet.create({
	para: {
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		color: APP_FONT.MONTSERRAT_HEADER,
		marginBottom: 6,
	},
	sectionHeaderText: {
		fontSize: 20,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		color: APP_FONT.MONTSERRAT_HEADER,
		marginTop: 16,
		marginBottom: 8,
	},
});

export default WhatIsFediverse;
