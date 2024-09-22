import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const ACCOUNT_INDICATOR_ICON_SIZE = 36;

const AppSelectedProfileIndicator = memo(() => {
	const { colorScheme } = useAppTheme();
	const { primaryAcct } = useActivityPubRestClientContext();
	const { isAnimating, visible } = useAppBottomSheet();
	const avatar = primaryAcct?.meta?.find((o) => o.key === 'avatar')?.value;

	const { setVisible, setType, updateRequestId } = useAppBottomSheet();

	function onLongPress() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		setType(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT);
		updateRequestId();
		setVisible(true);
	}

	function onPress() {
		router.navigate('/profile');
	}

	if (visible && isAnimating) return <View />;
	if (!primaryAcct)
		return (
			<TouchableOpacity
				style={styles.accountIconTouchableContainerRight}
				onPress={onPress}
				onLongPress={onLongPress}
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
				onPress={onPress}
				onLongPress={onLongPress}
			>
				<View style={styles.accountIconInternalContainer}>
					{/*@ts-ignore-next-line*/}
					<Image
						style={{
							width: ACCOUNT_INDICATOR_ICON_SIZE,
							height: ACCOUNT_INDICATOR_ICON_SIZE,
							opacity: 0.87,
							borderRadius: 8,
						}}
						source={{ uri: avatar }}
						contentFit="fill"
					/>
				</View>
				<View style={{ width: 14 }}>
					<Feather
						name="more-vertical"
						size={24}
						color={colorScheme.textColor.low}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
});

export default AppSelectedProfileIndicator;

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
		borderWidth: 0.5,
		borderColor: 'rgba(255, 255, 255, 0.25)',
	},
});
