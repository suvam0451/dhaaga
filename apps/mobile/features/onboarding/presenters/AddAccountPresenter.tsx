import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import React from 'react';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import ProtocolCards from '../components/ProtocolCards';
import { NativeTextBold, NativeTextMedium } from '#/ui/NativeText';

type AddAccountLandingFragmentProps = {
	containerStyle?: StyleProp<ViewStyle>;
	onSelectSetPagerId: (id: number) => void;
};

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * but share footer or page decorations)
 * @constructor
 */
export function AddAccountLandingFragment({
	containerStyle,
	onSelectSetPagerId,
}: AddAccountLandingFragmentProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<View style={containerStyle}>
			<NativeTextBold
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				style={[styles.noAccountText]}
			>
				Select Platform
			</NativeTextBold>
			<ProtocolCards onSelectSetPagerId={onSelectSetPagerId} />
			<View style={styles.tipContainer}>
				<AppIcon
					id={'info'}
					size={24}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
				/>
				<NativeTextMedium
					style={[
						styles.tipText,
						{
							color: theme.secondary.a40,
						},
					]}
				>
					{t(`onboarding.accountCreationNotSupported`)}
				</NativeTextMedium>
			</View>
		</View>
	);
}

/**
 * A full-screen cover when no account is selected
 * @constructor
 */

const styles = StyleSheet.create({
	noAccountText: {
		fontSize: 28,
		textAlign: 'center',
		marginBottom: 24,
	},
	selectSnsBox: {
		padding: 6,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
		borderRadius: 16,
		paddingHorizontal: 20,
	},
	selectSnsLabel: {
		fontSize: 22,
	},
	tipContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: 32,
	},
	tipText: {
		marginLeft: 6,
	},
});
