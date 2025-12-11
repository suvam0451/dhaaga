import { View, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { AppText } from '#/components/lib/Text';
import { Image } from 'expo-image';
import SoftwareHeader from '#/features/manage-accounts/SoftwareHeader';

export type AccountCreationPreviewProps = {
	avatar: string;
	displayName: string;
	username: string;
	software: string;
};

function UserDataPreview({
	avatar,
	displayName,
	username,
	software,
}: AccountCreationPreviewProps) {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				padding: 8,
				backgroundColor: theme.primary, // '#E5FFDA',
				borderRadius: 12,
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<View>
				{avatar && (
					<View style={{ height: 48, width: 48, borderRadius: 16 }}>
						<Image
							style={styles.image}
							source={avatar}
							contentFit="fill"
							transition={1000}
						/>
					</View>
				)}
			</View>
			<View style={{ marginLeft: 8, flexGrow: 1 }}>
				<AppText.SemiBold style={{ color: 'black' }}>
					{displayName}
				</AppText.SemiBold>
				<AppText.Medium style={{ color: 'gray', fontSize: 14 }}>
					{username}
				</AppText.Medium>
			</View>
			<View
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					flexDirection: 'row',
					marginRight: 8,
					alignItems: 'center',
				}}
			>
				<SoftwareHeader height={36} software={software} />
			</View>
		</View>
	);
}

type Props = {
	onConfirm: () => void;
	isLoading: boolean;
	buttonColor: string;
	userData: {
		displayName: string;
		username: string;
		avatar: string;
		software: string;
	} | null;
};
function AccountConfirmationPopup({
	onConfirm,
	isLoading,
	buttonColor,
	userData,
}: Props) {
	const { theme } = useAppTheme();

	return (
		<View
			style={[
				styles.sheetRoot,
				{
					backgroundColor: theme.background.a20,
				},
			]}
		>
			<Text
				style={{
					marginVertical: 20,
					color: theme.secondary.a10,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					textAlign: 'center',
					fontSize: 20,
				}}
			>
				Confirm your account
			</Text>
			<View
				style={{
					marginBottom: 16,
				}}
			>
				<Text
					style={{
						marginBottom: 12,
						color: theme.secondary.a30,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						textAlign: 'center',
					}}
				>
					A valid token was detected. Proceed with adding the account shown
					below ?
				</Text>
			</View>
			{userData && <UserDataPreview {...userData} />}
			<AppButtonVariantA
				label={'Confirm'}
				loading={false}
				onClick={onConfirm}
				style={{
					backgroundColor: buttonColor,
					marginTop: 32,
				}}
				textStyle={{
					color: theme.textColor.high,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	sheetRoot: {
		paddingHorizontal: 12,
		paddingBottom: 54 + 32,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		flex: 1,
		width: 48,
		backgroundColor: '#0553',
		borderRadius: 12,
	},
});

export default AccountConfirmationPopup;
