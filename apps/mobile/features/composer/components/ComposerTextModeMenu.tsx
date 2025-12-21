import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import PostButton from '#/components/dhaaga-bottom-sheet/modules/post-composer/fragments/PostButton';
import { useActiveUserSession, useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { PostInspector } from '@dhaaga/bridge';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';
import { usePostComposerState } from '@dhaaga/react';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';

/**
 * Indicates in which context this reply is being composed
 */
function ReplyIndicator() {
	const state = usePostComposerState();
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	if (!state.parent) return <View />;

	const _target = PostInspector.getContentTarget(state.parent);
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
			<NativeTextNormal
				style={[
					{
						flexShrink: 1,
						color: theme.secondary.a30,
					},
				]}
			>
				{t(`quickPost.replyingTo`)}
			</NativeTextNormal>
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
				<NativeTextNormal
					style={[
						{
							maxWidth: 208,
							color: theme.complementary,
							marginLeft: 6,
						},
					]}
					numberOfLines={1}
				>
					{_target.postedBy.handle}
				</NativeTextNormal>
			</View>
		</View>
	);
}

/**
 * The top section of the post-composer.
 *
 * For emoji selections, this section is hidden
 */
function ComposerTextModeMenu() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();

	return (
		<BottomSheetMenu
			title={null}
			variant={'raised'}
			CustomHeader={
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
						}}
					>
						<View style={styles.avatarBorderBox}>
							<Image source={acct?.avatarUrl} style={styles.avatarContainer} />
						</View>
						<View style={{ flexGrow: 1, marginLeft: 6 }}>
							<NativeTextBold
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								style={[styles.displayName]}
							>
								{acct?.displayName}
							</NativeTextBold>
							<NativeTextBold
								style={[
									styles.username,
									{
										color: theme.secondary.a40,
									},
								]}
							>
								@{acct?.username}
							</NativeTextBold>
						</View>
						<PostButton />
					</View>
					<ReplyIndicator />
				</View>
			}
		/>
	);
}

export default ComposerTextModeMenu;

const styles = StyleSheet.create({
	root: {
		flex: 1,
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
		marginLeft: 4,
	},
});
