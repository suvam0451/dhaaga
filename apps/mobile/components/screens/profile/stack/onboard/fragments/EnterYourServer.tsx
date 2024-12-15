import { Dispatch, memo, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import Feather from '@expo/vector-icons/Feather';
import { Button } from '@rneui/base';

type EnterYourServerProps = {
	setServerText: Dispatch<SetStateAction<string>>;
	ServerText: string;
	onPressLogin: () => Promise<void>;
	buttonColor: string;
};

const EnterYourServer = memo(
	({
		ServerText,
		setServerText,
		onPressLogin,
		buttonColor,
	}: EnterYourServerProps) => {
		return (
			<View>
				<Text
					style={{
						textAlign: 'center',
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 24,
						fontSize: 24,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					}}
				>
					Enter your server
				</Text>
				<View style={styles.inputContainerRoot}>
					<View style={styles.inputContainer}>
						<Feather name="server" size={24} color={APP_FONT.MONTSERRAT_BODY} />
					</View>
					<TextInput
						style={{
							fontSize: 16,
							color: APP_FONT.MONTSERRAT_HEADER,
							textDecorationLine: 'none',
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							flex: 1,
							marginLeft: 4,
						}}
						autoCapitalize={'none'}
						placeholderTextColor={APP_FONT.MONTSERRAT_BODY}
						placeholder="Your server url"
						onChangeText={setServerText}
						value={ServerText}
					/>
				</View>

				<View style={{ alignItems: 'center', marginTop: 16 }}>
					<Button
						disabled={false}
						color={buttonColor}
						onPress={onPressLogin}
						buttonStyle={{ width: 128, borderRadius: 8 }}
					>
						Log In
					</Button>
				</View>
			</View>
		);
	},
);

export default EnterYourServer;

const styles = StyleSheet.create({
	sectionHeaderText: {
		marginTop: 32,
		marginBottom: 12,
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
	},
	inputContainer: { width: 24 + 8 * 2, padding: 8 },
});