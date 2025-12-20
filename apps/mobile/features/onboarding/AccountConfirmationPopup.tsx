import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import { AppText } from '#/components/lib/Text';
import { Image } from 'expo-image';
import SoftwareHeader from '#/features/manage-accounts/SoftwareHeader';
import { NativeTextBold } from '#/ui/NativeText';

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
				styles.root,
				{
					backgroundColor: theme.background.a20,
				},
			]}
		>
			<NativeTextBold
				style={{
					marginVertical: 20,
					color: theme.secondary.a10,
					textAlign: 'center',
					fontSize: 20,
				}}
			>
				Confirm your account
			</NativeTextBold>
			<View
				style={{
					marginBottom: 16,
				}}
			>
				<NativeTextBold
					style={{
						marginBottom: 12,
						color: theme.secondary.a30,
						textAlign: 'center',
					}}
				>
					A valid token was detected. Proceed with adding the account shown
					below ?
				</NativeTextBold>
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
					color: theme.secondary.a10,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
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
