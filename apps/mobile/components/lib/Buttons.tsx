import { Button } from '@rneui/themed';
import {
	ActivityIndicator,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { APP_FONTS } from '../../styles/AppFonts';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { AppText } from './Text';
import { appDimensions } from '../../styles/dimensions';

type AppButtonVariantAProps = {
	label: string;
	loading: boolean;
	onClick: () => void;
	onLongClick?: () => void;
	opts?: {
		useHaptics?: boolean;
	};
	customLoadingState?: JSX.Element;
};

export function AppButtonVariantA({
	label,
	loading,
	onClick,
	onLongClick,
	opts,
	customLoadingState,
}: AppButtonVariantAProps) {
	function onPress() {
		if (onClick) {
			if (opts?.useHaptics) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
			onClick();
		}
	}

	function onLongPress() {
		if (onLongClick && !loading) {
			onLongClick();
		}
	}

	return (
		<Button
			size={'md'}
			buttonStyle={{ backgroundColor: '#333333', borderRadius: 8 }}
			containerStyle={{ borderRadius: 8 }}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			{loading ? (
				customLoadingState ? (
					customLoadingState
				) : (
					<ActivityIndicator size={20} color={'white'} />
				)
			) : (
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						opacity: 1,
						fontFamily: 'Inter-Bold',
					}}
				>
					{label}
				</Text>
			)}
		</Button>
	);
}

export function AppButtonVariantDestructive({
	label,
	loading,
	onClick,
	onLongClick,
	opts,
	customLoadingState,
}: AppButtonVariantAProps) {
	function onPress() {
		if (onClick) {
			if (opts?.useHaptics) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
			onClick();
		}
	}

	function onLongPress() {
		if (onLongClick && !loading) {
			onLongClick();
		}
	}

	return (
		<Button
			size={'md'}
			buttonStyle={{
				backgroundColor: 'red',
				borderRadius: 8,
			}}
			containerStyle={{ borderRadius: 8 }}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			{loading ? (
				customLoadingState ? (
					customLoadingState
				) : (
					<ActivityIndicator size={20} color={'rgba(255, 255, 255, 0.6)'} />
				)
			) : (
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						opacity: 1,
						fontFamily: 'Inter-Bold',
					}}
				>
					{label}
				</Text>
			)}
		</Button>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: appDimensions.buttons.borderRadius,
		paddingVertical: 8,
		minWidth: 128,
	},
	passiveButtonStyle: {
		borderColor: 'red',
		backgroundColor: '#2e6945', // '#cb6483',
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	passiveTextStyle: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	activeButtonStyle: {
		borderColor: '#cb6483',
		backgroundColor: '#363636',
		borderRadius: 4,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	activeTextStyle: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

type AppButtonClassicInvertedProps = {
	label: string;
	onClick: () => void;
};

export const AppButtonClassicInverted = memo(function Foo({
	label,
	onClick,
}: AppButtonClassicInvertedProps) {
	return (
		<View
			style={{
				borderRadius: 4,
				backgroundColor: 'rgba(170, 170, 170, 0.87)',
				padding: 8,
				marginRight: 8,
			}}
			onTouchEnd={onClick}
		>
			<Text
				style={{
					color: 'rgba(0, 0, 0, 1)',
					fontFamily: 'Montserrat-Bold',
					textAlign: 'center',
				}}
			>
				{label}
			</Text>
		</View>
	);
});

type AppTimelineActionProps = {
	label: string;
	Icon: JSX.Element;
};

export const AppTimelineAction = memo(function Foo({
	Icon,
	label,
}: AppTimelineActionProps) {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginRight: 8,
				paddingVertical: 8,
				paddingHorizontal: 4,
			}}
		>
			{Icon}
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					marginLeft: 4,
					fontFamily: 'Montserrat-Bold',
				}}
			>
				{label}
			</Text>
		</View>
	);
});

type AppButtonBottomSheetActionProps = {
	label?: string;
	onPress: () => void;
	Icon: any;
	loading: boolean;
	style?: StyleProp<ViewStyle>;
	type: APP_BOTTOM_SHEET_ACTION_CATEGORY;
	disabled: boolean;
};

export enum APP_BOTTOM_SHEET_ACTION_CATEGORY {
	PROGRESS,
	CANCEL,
}

/**
 * The buttons used in Dhaaga bottom sheets
 */
export const AppButtonBottomSheetAction = memo(
	({
		label,
		onPress,
		Icon,
		loading,
		type,
		style,
		disabled,
	}: AppButtonBottomSheetActionProps) => {
		const { theme } = useAppTheme();
		const bgColor: Record<APP_BOTTOM_SHEET_ACTION_CATEGORY, string> = {
			[APP_BOTTOM_SHEET_ACTION_CATEGORY.CANCEL]: theme.complementary.a0,
			[APP_BOTTOM_SHEET_ACTION_CATEGORY.PROGRESS]:
				APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
		};

		return (
			<TouchableOpacity
				style={[
					{
						backgroundColor: bgColor[type],
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 12,
						borderRadius: 8,
						paddingVertical: 6,
					},
					style,
				]}
				onPress={onPress}
			>
				{label && (
					<Text
						style={{
							color: disabled ? APP_FONT.DISABLED : APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						}}
					>
						{label}
					</Text>
				)}
				{loading ? (
					<ActivityIndicator
						color={APP_FONT.MONTSERRAT_BODY}
						style={{ marginLeft: 6 }}
					/>
				) : (
					Icon
				)}
			</TouchableOpacity>
		);
	},
);

type AppCtaButtonProps = {
	label: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
};

/**
 * This button appears on pages with a cta
 * @param label
 * @param onPress
 * @param style
 * @constructor
 */
export function AppCtaButton({ label, onPress, style }: AppCtaButtonProps) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={[{ marginTop: 20, paddingBottom: 54 + 16 }, style]}
			onPress={onPress}
		>
			<View
				style={{
					backgroundColor: theme.primary.a0,
					padding: 8,
					borderRadius: 8,
					paddingHorizontal: 16,
					maxWidth: 196,
					alignSelf: 'center',
				}}
			>
				<AppText.SemiBold
					style={{ color: 'black', textAlign: 'center', fontSize: 18 }}
				>
					{label}
				</AppText.SemiBold>
			</View>
		</Pressable>
	);
}

type ButtonVariant = 'blank' | 'cta' | 'warm' | 'info' | 'warn' | 'error';

export type RelationshipButtonProps = {
	loading: boolean;
	onPress: () => void;
	label: string;
	variant: ButtonVariant;
	style?: StyleProp<ViewStyle>;
};

export function CurrentRelationView({
	loading,
	onPress,
	label,
	variant,
	style,
}: RelationshipButtonProps) {
	const { theme } = useAppTheme();

	const bgColor: Record<ButtonVariant, string> = {
		blank: 'transparent',
		error: 'red',
		cta: theme.primary.a0,
		info: theme.background.a20,
		warn: 'orange',
		warm: 'transparent',
	};

	const fgColor: Record<ButtonVariant, string> = {
		blank: 'transparent',
		error: 'red',
		cta: 'black',
		info: theme.complementary.a0,
		warn: 'orange',
		warm: theme.primary.a0,
	};

	if (variant === 'blank') return <View style={[styles.button, style]} />;

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.button,
				{
					backgroundColor: bgColor[variant],
				},
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator size={20} color={fgColor[variant]} />
			) : (
				<AppText.Medium
					style={[
						{ color: fgColor[variant], fontSize: 16, textAlign: 'center' },
					]}
				>
					{label}
				</AppText.Medium>
			)}
		</Pressable>
	);
}
