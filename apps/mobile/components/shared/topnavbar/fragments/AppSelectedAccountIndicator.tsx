import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { AppIcon } from '../../../lib/Icon';

const ACCOUNT_INDICATOR_ICON_SIZE = 36;

/**
 * An indicator for the currently active
 * account.
 *
 * width = 36 + 2 + 4 = 42
 * Clicking on it will bring up the account switcher
 *
 * @deprecated in favor of 5th tab since v0.11.0
 */
const AppSelectedAccountIndicator = memo(() => {
	const { primaryAcct } = useActivityPubRestClientContext();
	const { setVisible, setType, updateRequestId } = useAppBottomSheet();
	const avatar = primaryAcct?.meta?.find((o) => o.key === 'avatar')?.value;

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
				<AppIcon id={'no-account'} size={28} />
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
