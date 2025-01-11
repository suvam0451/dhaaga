import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import PostButton from './PostButton';
import { useComposerContext } from '../api/useComposerContext';
import appTextStyling from '../../../../../styles/AppTextStyling';
import {
	useAppAcct,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';

/**
 * Indicates in which context this reply is being composed
 */
function ReplyIndicator() {
	const { state } = useComposerContext();
	const { theme } = useAppTheme();

	if (!state.parent) return <View />;

	const _target = PostMiddleware.getContentTarget(state.parent);
	return (
		<View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
			<Text
				style={[
					appTextStyling.postContext,
					{ flexShrink: 1, color: theme.secondary.a30 },
				]}
			>
				Replying to{' '}
			</Text>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: theme.palette.menubar,
					borderRadius: 8,
					padding: 4,
					paddingHorizontal: 6,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{ uri: _target.postedBy.avatarUrl }}
					style={{ width: 24, height: 24, borderRadius: 8 }}
				/>
				<Text
					style={[
						appTextStyling.postContext,
						{ maxWidth: 208, color: theme.complementary.a0 },
					]}
					numberOfLines={1}
				>
					{_target.postedBy.handle}
				</Text>
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
	const { acct } = useAppAcct();

	return (
		<Fragment>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginTop: 16,
				}}
			>
				<View
					style={{
						borderWidth: 0.7,
						borderColor: '#666',
						borderRadius: '100%',
						overflow: 'hidden',
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image source={acct?.avatarUrl} style={styles.avatarContainer} />
				</View>
				<View style={{ flexGrow: 1, marginLeft: 6 }}>
					<Text
						style={[
							styles.displayName,
							{
								color: theme.textColor.medium,
							},
						]}
					>
						{acct?.displayName}
					</Text>
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
		</Fragment>
	);
}

const styles = StyleSheet.create({
	avatarContainer: {
		height: 36,
		width: 36,
		borderRadius: '100%',
	},
	displayName: {
		fontSize: 16,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		marginLeft: 4,
	},
	username: {
		fontSize: 13,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginLeft: 4,
	},
});

export default ComposerTopMenu;
