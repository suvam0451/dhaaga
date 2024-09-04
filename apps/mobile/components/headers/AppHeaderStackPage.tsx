import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';
import { router } from 'expo-router';
import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AccountRepository from '../../repositories/account.repo';
import { useObject, useRealm } from '@realm/react';
import { Account } from '../../entities/account.entity';
import { Image } from 'expo-image';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { BSON } from 'realm';

const ACCOUNT_INDICATOR_ICON_SIZE = 36;

/**
 * An indicator for the currently active
 * account.
 *
 * Clicking on it will bring up the account switcher
 */
export const AppSelectedAccountIndicator = memo(() => {
	const { primaryAcct, PrimaryAcctPtr } = useActivityPubRestClientContext();
	const { setVisible, setType, updateRequestId } = useAppBottomSheet();

	const account = useObject(Account, PrimaryAcctPtr.current || new BSON.UUID());
	const db = useRealm();
	const avatar = AccountRepository.findSecret(db, account, 'avatar')?.value;

	function onAccountSelectRequest() {
		setType(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT);
		updateRequestId();
		setVisible(true);
	}

	if (!primaryAcct)
		return (
			<TouchableOpacity
				style={styles.accountIconTouchableContainer}
				onPress={onAccountSelectRequest}
			>
				<MaterialIcons
					name="no-accounts"
					size={28}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
			</TouchableOpacity>
		);
	return (
		<TouchableOpacity
			style={styles.accountIconTouchableContainer}
			onPress={onAccountSelectRequest}
		>
			<View style={styles.accountIconInternalContainer}>
				{/*@ts-ignore-next-line*/}
				<Image
					style={{
						width: ACCOUNT_INDICATOR_ICON_SIZE,
						height: ACCOUNT_INDICATOR_ICON_SIZE,
						opacity: 0.8,
						borderRadius: 8,
					}}
					source={{ uri: avatar }}
					contentFit="fill"
				/>
			</View>
		</TouchableOpacity>
	);
});

type HeadersProps = {
	title: string;
};
const AppHeaderStackPage = ({ title }: HeadersProps) => {
	return (
		<>
			<View
				style={[
					styles.subHeader,
					{
						backgroundColor: '#1c1c1c',
						height: 50,
					},
				]}
			>
				<TouchableOpacity
					onPress={() => {
						router.back();
					}}
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'row',
						paddingHorizontal: 8,
					}}
				>
					<Ionicons
						name="chevron-back"
						size={24}
						color="rgba(255, 255, 255, 0.6)"
					/>
				</TouchableOpacity>
				<View style={styles.navbarTitleContainer}>
					<Text style={styles.navbarTitle}>{title}</Text>
				</View>
				<AppSelectedAccountIndicator />
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'blue',
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
	buttonContainer: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 10,
	},
	accountIconTouchableContainer: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 2,
		paddingRight: 8,
	},
	accountIconInternalContainer: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: 'gray',
	},
});
export default AppHeaderStackPage;
