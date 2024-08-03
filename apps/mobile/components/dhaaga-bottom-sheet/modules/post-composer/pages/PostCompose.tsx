import { memo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import ComposerAutoCompletion from '../fragments/ComposerAutoCompletion';
import { Image } from 'expo-image';
import VisibilityPicker from '../fragments/VisibilityPicker';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PostButton from '../fragments/PostButton';
import ComposerTextInput from '../fragments/ComposerText';
import ComposeMediaTargets from '../fragments/MediaTargets';
import ActionButtons from '../fragments/ActionButtons';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import ComposerSpoiler from '../fragments/ComposerSpoiler';

const PostCompose = memo(() => {
	const { visible } = useAppBottomSheet();
	const { me } = useActivityPubRestClientContext();

	return (
		<View
			style={[
				styles.bottomSheetContentContainer,
				{ display: visible ? 'flex' : 'none' },
			]}
		>
			<ComposerAutoCompletion />
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
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
							color: APP_FONT.MONTSERRAT_BODY,
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
			<ScrollView>
				<ComposerSpoiler />
				<ComposerTextInput />
				<View style={{ flexGrow: 1, flex: 1 }} />
				<ComposeMediaTargets />
			</ScrollView>
			{/*spacer*/}
			<View style={{ flexGrow: 1, flex: 1 }} />
			{/*<ComposeMediaTargets />*/}
			<ActionButtons />
		</View>
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

export default PostCompose;
