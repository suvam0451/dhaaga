import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import Feather from '@expo/vector-icons/Feather';
import { Button } from '@rneui/base';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Loader } from '../../../components/lib/Loader';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type EnterYourServerProps = {
	setServerText: Dispatch<SetStateAction<string>>;
	ServerText: string;
	onPressLogin: () => Promise<void>;
	buttonColor: string;
	isLoading: boolean;
};

function ServerInputView({
	ServerText,
	setServerText,
	onPressLogin,
	buttonColor,
	isLoading,
}: EnterYourServerProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View>
			<Text
				style={{
					textAlign: 'center',
					color: theme.secondary.a20,
					marginBottom: 24,
					fontSize: 24,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
				}}
			>
				{t(`onboarding.enterYourServer`)}
			</Text>
			<View style={styles.inputContainerRoot}>
				<View style={styles.inputContainer}>
					<Feather name="server" size={24} color={theme.secondary.a20} />
				</View>
				<TextInput
					style={{
						fontSize: 16,
						color: theme.secondary.a10,
						textDecorationLine: 'none',
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						flex: 1,
						marginLeft: 4,
					}}
					autoCapitalize={'none'}
					placeholderTextColor={theme.secondary.a30}
					placeholder={t(`onboarding.serverUrl`)}
					onChangeText={setServerText}
					value={ServerText}
				/>
			</View>

			<View style={{ alignItems: 'center', marginTop: 16 }}>
				{isLoading ? (
					<View style={{ paddingVertical: 16 }}>
						<Loader />
					</View>
				) : (
					<Button
						disabled={false}
						color={buttonColor}
						onPress={onPressLogin}
						buttonStyle={{ width: 128, borderRadius: 8 }}
					>
						{t(`onboarding.loginButton`)}
					</Button>
				)}
			</View>
		</View>
	);
}

export default ServerInputView;

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
