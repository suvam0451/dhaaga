import { useSocialHubFeedPinStatus } from '#/features/social-hub/api/useSocialHubFeedPinStatus';
import { Profile } from '@dhaaga/db';
import { useProfileMutation } from '#/features/app-profiles/api/useProfileMutation';
import { Pressable, View, StyleSheet } from 'react-native';
import type { FeedObjectType } from '@dhaaga/bridge';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { NativeTextMedium } from '#/ui/NativeText';

type Props = {
	profile: Profile;
	feed: FeedObjectType;
	onChangeCallback: () => void;
};

function BskyFeedAddListItemView({ profile, feed, onChangeCallback }: Props) {
	const { toggleFeedPin } = useProfileMutation();
	const { data, refetch } = useSocialHubFeedPinStatus(profile, feed);
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	function onToggle() {
		toggleFeedPin
			.mutateAsync({
				feed,
				profile,
			})
			.finally(() => {
				refetch();
				if (onChangeCallback) onChangeCallback();
			});
	}

	return (
		<View style={styles.root}>
			<View style={{ flexDirection: 'row' }}>
				<Image source={{ uri: feed.avatar }} style={styles.avatar} />
				<View style={{ marginLeft: 8, flex: 1 }}>
					<NativeTextMedium
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
						}}
					>
						{feed.displayName}
					</NativeTextMedium>
					<NativeTextMedium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
						style={{ fontSize: 13, color: theme.complementary.a0 }}
					>
						{feed.likeCount} {t(`noun.like`, { count: feed.likeCount })} @
						{feed.creator.handle}
					</NativeTextMedium>
				</View>
				<Pressable onPress={onToggle}>
					{data ? (
						<AppIcon
							id={'checkmark-circle'}
							size={32}
							color={theme.primary.a0}
						/>
					) : (
						<AppIcon
							id={'add-circle-outline'}
							size={32}
							color={theme.secondary.a30}
						/>
					)}
				</Pressable>
			</View>
			<NativeTextMedium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				style={{
					fontSize: 13,
					marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
				}}
			>
				{feed.description}
			</NativeTextMedium>
		</View>
	);
}

export default BskyFeedAddListItemView;

const styles = StyleSheet.create({
	root: { paddingHorizontal: 10, flex: 1, overflow: 'hidden', marginRight: 8 },
	avatar: { width: 42, height: 42, borderRadius: 42 / 2 },
});
