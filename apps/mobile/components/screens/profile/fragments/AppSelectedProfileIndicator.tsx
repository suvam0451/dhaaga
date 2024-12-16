import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const ACCOUNT_INDICATOR_ICON_SIZE = 36;

const AppSelectedProfileIndicator = memo(() => {
	const { acct, show, theme, isAnimating, visible } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			show: o.bottomSheet.show,
			setType: o.bottomSheet.setType,
			theme: o.colorScheme,
			visible: o.bottomSheet.visible,
			isAnimating: o.bottomSheet.isAnimating,
		})),
	);

	function onLongPress() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		show(APP_BOTTOM_SHEET_ENUM.SELECT_ACCOUNT);
	}

	function onPress() {
		router.navigate('/profile');
	}

	if (visible && isAnimating) return <View />;
	if (!acct)
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
		<View style={{ flexDirection: 'row', flex: 1 }}>
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
						source={{ uri: acct?.avatarUrl }}
						contentFit="fill"
					/>
				</View>
				<View style={{ width: 14 }}>
					<Feather name="more-vertical" size={24} color={theme.textColor.low} />
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
		paddingTop: 12,
	},
	accountIconTouchableContainerRight: {
		height: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 2,
		paddingRight: 8,
		marginTop: 10,
	},
	accountIconInternalContainer: {
		borderRadius: 8,
		borderWidth: 0.5,
		borderColor: 'rgba(255, 255, 255, 0.25)',
	},
});
