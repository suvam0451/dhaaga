import { useAppApiClient, useAppTheme } from '#/states/global/hooks';
import { ScrollView, StyleSheet } from 'react-native';
import { AppText } from '../../lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { ActivityPubService } from '@dhaaga/bridge';
import BskyFeedAddPresenter from './components/BskyFeedAddPresenter';

/**
 * Adding remote feeds is currently
 * not supported for Mastodon and Misskey
 * @constructor
 */
function FeatureNotSupported() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const title = t(`hubAddFeedSheet.title`);
	const desc = t(`hubAddFeedSheet.desc`, {
		returnObjects: true,
	}) as string[];
	return (
		<ScrollView contentContainerStyle={{ padding: 10 }}>
			<AppText.SemiBold
				style={[styles.sheetTitle, { color: theme.secondary.a10 }]}
			>
				{title}
			</AppText.SemiBold>
			{desc.map((o, i) => (
				<AppText.Medium
					forwardedKey={i}
					style={[styles.sheetDesc, { color: theme.secondary.a30 }]}
				>
					{o}
				</AppText.Medium>
			))}
		</ScrollView>
	);
}

function HubFeedAddBottomSheet() {
	const { driver } = useAppApiClient();

	if (!ActivityPubService.blueskyLike(driver)) return <FeatureNotSupported />;
	return <BskyFeedAddPresenter />;
}

export default HubFeedAddBottomSheet;

const styles = StyleSheet.create({
	sheetTitle: {
		fontSize: 28,
		textAlign: 'center',
		marginTop: 48,
		marginBottom: 24,
	},
	sheetDesc: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 8,
		maxWidth: 256,
		alignSelf: 'center',
	},
});
