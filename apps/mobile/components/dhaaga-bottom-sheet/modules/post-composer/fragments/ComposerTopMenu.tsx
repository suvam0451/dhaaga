import { Fragment, memo } from 'react';
import ComposerAutoCompletion from './ComposerAutoCompletion';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import VisibilityPicker from './VisibilityPicker';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PostButton from './PostButton';
import ReplyContextIndicator from './ReplyContextIndicator';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { useComposerContext } from '../api/useComposerContext';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import ComposerDecorator from './ComposerDecorator';

/**
 * The top section of the post composer.
 *
 * For emoji selections, this section is hidden
 */
const ComposerTopMenu = memo(() => {
	const { me } = useActivityPubRestClientContext();
	const { editMode } = useComposerContext();
	const { colorScheme } = useAppTheme();

	if (editMode === 'emoji') return <View />;
	if (editMode === 'alt') {
		return <View style={{ height: 16 }} />;
	}
	return (
		<Fragment>
			<ComposerAutoCompletion />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					position: 'relative',
				}}
			>
				<ComposerDecorator />
				<View
					style={{ borderWidth: 0.7, borderColor: '#666', borderRadius: 8 }}
				>
					{/*@ts-ignore-next-line*/}
					<Image source={me?.getAvatarUrl()} style={styles.avatarContainer} />
				</View>
				<View
					style={{
						paddingHorizontal: 4,
						maxWidth: 256,
						marginLeft: 4,
						flex: 1,
					}}
				>
					<VisibilityPicker />
					<Text
						style={{
							color: colorScheme.textColor.medium,
							fontSize: 11.5,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							opacity: 0.8,
							marginLeft: 4,
						}}
					>
						@{me?.getUsername()}
					</Text>
				</View>
				<View style={{ flexGrow: 1 }} />
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-end',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<TouchableOpacity style={{ padding: 8, marginRight: 4, width: 42 }}>
						<FontAwesome6
							name="binoculars"
							size={22}
							color={APP_FONT.DISABLED}
						/>
					</TouchableOpacity>
					<PostButton />
				</View>
			</View>
			<ReplyContextIndicator />
		</Fragment>
	);
});

const styles = StyleSheet.create({
	textInput: {
		textDecorationLine: 'none',
		textDecorationStyle: undefined,
		width: '100%',
		paddingVertical: 16,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		paddingBottom: 13,
	},
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		backgroundColor: '#2C2C2C',
	},
	bottomSheetContentContainer: {
		padding: 16,
		paddingTop: 0,
		height: '100%',
	},
	avatarContainer: {
		height: 48,
		width: 48,
		borderRadius: 8,
		opacity: 0.87,
	},
});

export default ComposerTopMenu;
