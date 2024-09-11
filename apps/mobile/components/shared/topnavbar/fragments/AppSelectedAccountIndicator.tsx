import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useObject, useRealm } from '@realm/react';
import { Account } from '../../../../entities/account.entity';
import { BSON } from 'realm';
import AccountRepository from '../../../../repositories/account.repo';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../styles/AppFonts';

const ACCOUNT_INDICATOR_ICON_SIZE = 36;

/**
 * An indicator for the currently active
 * account.
 *
 * width = 36 + 2 + 4 = 42
 * Clicking on it will bring up the account switcher
 */
const AppSelectedAccountIndicator = memo(() => {
	const { primaryAcct } = useActivityPubRestClientContext();
	const { setVisible, setType, updateRequestId } = useAppBottomSheet();

	const account = useObject(
		Account,
		primaryAcct?.isValid() ? primaryAcct?._id : new BSON.UUID(),
	);
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
				style={styles.accountIconTouchableContainerRight}
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
		<View style={{ flexDirection: 'row' }}>
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
		</View>
	);
});

export default AppSelectedAccountIndicator;

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
	accountIconTouchableContainerRight: {
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
