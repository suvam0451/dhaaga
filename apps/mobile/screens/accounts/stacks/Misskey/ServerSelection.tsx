import { useEffect, useState } from 'react';
import {
	Keyboard,
	TouchableOpacity,
	View,
	Text,
	TextInput,
} from 'react-native';
import { MainText } from '../../../../styles/Typography';
import { Button } from '@rneui/base';
import { createCodeRequestUrl } from '@dhaaga/shared-provider-misskey/src';
import * as Crypto from 'expo-crypto';
import { useNavigation, useRoute } from '@react-navigation/native';
import TitleOnlyStackHeaderContainer from '../../../../components/containers/TitleOnlyStackHeaderContainer';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';

function MisskeyServerSelection() {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [InputText, setInputText] = useState('misskey.io');
	const route = useRoute();
	const navigation = useNavigation<any>();

	async function onPressNext() {
		const authUrl = await createCodeRequestUrl(
			`https://${InputText}`,
			Crypto.randomUUID(),
		);
		const subdomain = `https://${InputText}`;
		navigation.navigate('Misskey Sign-In', { signInUrl: authUrl, subdomain });
	}

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

	const popularServers = [
		{ value: 'misskey.io', label: 'misskey.io' },
		{ value: 'misskey.dev', label: 'misskey.dev' },
		{ value: 'misskey.id', label: ' 🇮🇩misskey.id' },
		{ value: 'hallsofamenti.io', label: 'hallsofamenti.io' },
	];

	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Select Instance`}
		>
			<View
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					height: '100%',
					marginTop: 16,
				}}
			>
				<View>
					{!isKeyboardVisible && (
						<View>
							<MainText style={{ marginBottom: 16 }}>
								Step 1: Select your server
							</MainText>

							<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
								{popularServers.map((server, i) => (
									<TouchableOpacity
										key={i}
										onPress={() => {
											setInputText(server.value);
										}}
									>
										<View
											style={{
												padding: 8,
												margin: 4,
												backgroundColor: APP_THEME.CARD_BACKGROUND_DARKEST,
												borderRadius: 4,
											}}
										>
											<Text style={{ color: APP_FONT.MONTSERRAT_HEADER }}>
												{server.label}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					<MainText style={{ marginTop: 32, marginBottom: 12 }}>
						Or, enter it manually
					</MainText>
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Text style={{ fontSize: 16, color: 'gray' }}>https://</Text>
						<TextInput
							style={{
								fontSize: 16,
								color: APP_THEME.LINK,
								textDecorationLine: 'underline',
							}}
							placeholder="misskey.io"
							defaultValue="misskey.io"
							onChangeText={setInputText}
							value={InputText}
						/>
						<Text style={{ fontSize: 16, color: 'gray' }}>
							{'/miauth/{session}'}
						</Text>
					</View>
				</View>
				<View style={{ marginBottom: 32 }}>
					<Button
						color={'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))'}
						style={{ width: 100, marginBottom: 32 }}
						onPress={onPressNext}
					>
						Next
					</Button>
				</View>
			</View>
		</TitleOnlyStackHeaderContainer>
	);
}

export default MisskeyServerSelection;
