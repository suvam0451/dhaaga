import { useEffect, useState } from 'react';
import {
	Keyboard,
	Modal,
	Pressable,
	TouchableOpacity,
	View,
	Text,
	TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import IconBasedFlipper from '../utils/IconBasedFlipper';
import * as ImagePicker from 'expo-image-picker';
import { APP_FONT } from '../../styles/AppTheme';
import CustomEmojiPicker from '../utils/CustomEmojiPicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import VisibilityPicker from '../dhaaga-bottom-sheet/modules/post-composer/fragments/VisibilityPicker';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function PostComposerBottomSheet() {
	const { me } = useGlobalState(
		useShallow((o) => ({
			me: o.me,
		})),
	);
	const [ActionIndex, setActionIndex] = useState(0);

	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [image, setImage] = useState(null);
	const [EmojiPickerVisible, setEmojiPickerVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false); // or some other action
			},
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	async function handleExpoFilePicker() {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All, // allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			console.log(result.assets[0].uri);
		}
	}

	function onCustomEmojiClicked() {
		setEmojiPickerVisible(true);
	}

	return (
		<View style={{ backgroundColor: 'red' }}>
			<View
				style={{
					paddingHorizontal: 16,
					backgroundColor: '#2C2C2C',
				}}
			>
				<View style={{ display: 'flex', flexDirection: 'column' }}>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<View style={{ width: 48, height: 48 }}>
							{/*@ts-ignore-next-line*/}
							<Image
								source={me.avatarUrl}
								style={{
									height: 48,
									width: 48,
									borderRadius: 8,
									opacity: 0.87,
								}}
							/>
						</View>
						<View
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								marginLeft: 8,
								flexGrow: 1,
							}}
						>
							<View
								style={{
									padding: 4,
									borderWidth: 2,
									borderColor: 'gray',
									width: 'auto',
									maxWidth: 80,
									overflow: 'hidden',
								}}
							>
								<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
									Everyone
								</Text>
								<VisibilityPicker />
							</View>
							{/*<View*/}
							{/*	style={{*/}
							{/*		maxWidth: 148,*/}
							{/*		overflow: 'hidden',*/}
							{/*	}}*/}
							{/*>*/}
							{/*	<Text*/}
							{/*		style={{*/}
							{/*			fontSize: 12,*/}
							{/*			color: APP_FONT.MONTSERRAT_BODY,*/}
							{/*			fontFamily: APP_FONTS.INTER_500_MEDIUM,*/}
							{/*		}}*/}
							{/*		numberOfLines={1}*/}
							{/*	>*/}
							{/*		{me.getAppDisplayAccountUrl('N/A')}*/}
							{/*	</Text>*/}
							{/*</View>*/}
						</View>
						<View>
							<IconBasedFlipper
								items={[
									<FontAwesome6 name="pencil" size={20} color="#fff" />,
									<FontAwesome5 name="images" size={20} color="#fff" />,
									<FontAwesome5 name="eye" size={20} color="#fff" />,
								]}
								setIndex={setActionIndex}
								index={ActionIndex}
							/>
						</View>
					</View>
					<View style={{ marginTop: 8 }}>
						<TextInput
							multiline={true}
							placeholder={"What's on your mindsss?"}
							placeholderTextColor={'rgba(255, 255, 255, 0.33)'}
							style={{
								textDecorationLine: 'none',
								textDecorationStyle: undefined,
								width: '100%',
								height: 48,
								paddingVertical: 16,
								paddingLeft: 4,
								color: APP_FONT.MONTSERRAT_BODY,
								fontSize: 16,
								paddingBottom: 13,
							}}
						/>
					</View>
				</View>
			</View>
			<View style={{ flexGrow: 1, flex: 1 }} />
			<View
				style={{
					backgroundColor: '#2C2C2C',
					paddingHorizontal: 16,
				}}
			>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<TouchableOpacity onPress={handleExpoFilePicker}>
						<FontAwesome
							name="image"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</TouchableOpacity>
					<FontAwesome
						name="warning"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
						style={{ marginLeft: 16 }}
					/>
					<Pressable onPress={onCustomEmojiClicked}>
						<FontAwesome6
							name="smile"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
							style={{ marginLeft: 16 }}
						/>
					</Pressable>
				</View>
			</View>
			<View
				style={{
					backgroundColor: '#2C2C2C',
				}}
			>
				<View style={{ position: 'relative' }}>
					<View style={{ borderRadius: 8 }}>
						{image && ( // @ts-ignore-next-line
							<Image
								source={image}
								style={{
									height: 128,
									width: 100,
									borderRadius: 8,
								}}
							/>
						)}
					</View>

					<View
						style={{
							position: 'absolute',
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-end',
						}}
					>
						<View style={{ position: 'relative' }}>
							<View style={{ position: 'absolute', left: -16, bottom: -16 }}>
								<Ionicons name="close-circle" size={28} color="red" />
							</View>
						</View>
					</View>
				</View>
			</View>
			<Modal
				animationType="slide"
				visible={EmojiPickerVisible}
				transparent={true}
				onRequestClose={() => {
					setEmojiPickerVisible(false);
				}}
			>
				<CustomEmojiPicker
					onBackdropPressed={() => {
						setEmojiPickerVisible(false);
					}}
				/>
			</Modal>
		</View>
	);
}

export default PostComposerBottomSheet;
