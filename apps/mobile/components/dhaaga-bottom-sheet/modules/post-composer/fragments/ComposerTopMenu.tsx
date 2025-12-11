import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '#/styles/AppFonts';
import PostButton from './PostButton';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import { PostMiddleware } from '#/services/middlewares/post.middleware';
import { appDimensions } from '#/styles/dimensions';
import { AppText } from '../../../../lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import useComposer from '#/states/app/useComposer';

/**
 * Indicates in which context this reply is being composed
 */
function ReplyIndicator() {
	const { state } = useComposer();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	if (!state.parent) return <View />;

	const _target = PostMiddleware.getContentTarget(state.parent);
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<AppText.Medium
				style={[
					{
						flexShrink: 1,
						color: theme.secondary.a30,
					},
				]}
			>
				{t(`quickPost.replyingTo`)}
			</AppText.Medium>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: 6,
				}}
			>
				<Image
					source={{ uri: _target.postedBy.avatarUrl }}
					style={{ width: 24, height: 24, borderRadius: 8 }}
				/>
				<AppText.Medium
					style={[
						{
							maxWidth: 208,
							color: theme.complementary.a0,
							marginLeft: 6,
						},
					]}
					numberOfLines={1}
				>
					{_target.postedBy.handle}
				</AppText.Medium>
			</View>
		</View>
	);
}

/**
 * The top section of the post composer.
 *
 * For emoji selections, this section is hidden
 */
function ComposerTopMenu() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();

	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a30,
				},
			]}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: appDimensions.timelines.sectionBottomMargin * 0.5,
				}}
			>
				<View style={styles.avatarBorderBox}>
					<Image source={acct?.avatarUrl} style={styles.avatarContainer} />
				</View>
				<View style={{ flexGrow: 1, marginLeft: 6 }}>
					<AppText.SemiBold
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						style={[styles.displayName]}
					>
						{acct?.displayName}
					</AppText.SemiBold>
					<Text
						style={[
							styles.username,
							{
								color: theme.secondary.a40,
							},
						]}
					>
						@{acct?.username}
					</Text>
				</View>
				<PostButton />
			</View>
			<ReplyIndicator />
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		padding: 10,
		paddingTop: appDimensions.bottomSheet.clearanceTop,
	},
	avatarBorderBox: {
		borderWidth: 0.75,
		borderColor: '#666',
		borderRadius: '100%',
		overflow: 'hidden',
	},
	avatarContainer: {
		height: 36,
		width: 36,
		borderRadius: 19,
	},
	displayName: {
		fontSize: 16,
		marginLeft: 4,
	},
	username: {
		fontSize: 13,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginLeft: 4,
	},
});

export default ComposerTopMenu;
