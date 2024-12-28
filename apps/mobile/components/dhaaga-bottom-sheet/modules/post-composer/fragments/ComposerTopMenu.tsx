import { Fragment, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import ReplyContextIndicator from './ReplyContextIndicator';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import PostButton from './PostButton';

/**
 * The top section of the post composer.
 *
 * For emoji selections, this section is hidden
 */
const ComposerTopMenu = memo(() => {
	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

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
			<ReplyContextIndicator />
		</Fragment>
	);
});

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
