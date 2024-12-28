import { Fragment, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import ReplyContextIndicator from './ReplyContextIndicator';
import { useComposerContext } from '../api/useComposerContext';
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
	const { editMode } = useComposerContext();

	if (editMode === 'emoji') return <View />;
	if (editMode === 'alt') {
		return <View style={{ height: 16, backgroundColor: 'pink' }} />;
	}
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
						style={{
							color: theme.textColor.medium,
							fontSize: 16,
							fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
							marginLeft: 4,
						}}
					>
						{acct?.displayName}
					</Text>
					<Text
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							marginLeft: 4,
						}}
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
});

export default ComposerTopMenu;
