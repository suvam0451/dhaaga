import { ReactNode } from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { APP_FONT, APP_THEME } from '#/styles/AppTheme';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '#/states/global/hooks';
import { AppText } from './Text';
import { appDimensions } from '#/styles/dimensions';
import appStyles from '#/styles/AppStyles';
import { NativeTextBold } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

const BUTTON_KINDS = [
	'primary',
	'secondary',
	'reversed',
	'attention',
	'alert',
	'outlined',
	'outlinedAlert',
	'ghost',
	'ghostSecondary',
] as const;

type ButtonVariantEnum = (typeof BUTTON_KINDS)[number];

type AppButtonVariantAProps = {
	label: string;
	loading: boolean;
	disabled?: boolean;
	onClick: () => void;
	onLongClick?: () => void;
	opts?: {
		useHaptics?: boolean;
	};
	customLoadingState?: ReactNode;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>;
	variant?: ButtonVariantEnum;
	iconId?: string;
};

export function AppButtonVariantA({
	iconId,
	label,
	loading,
	onClick,
	onLongClick,
	opts,
	style,
	textStyle,
	disabled,
	variant,
}: AppButtonVariantAProps) {
	const { theme } = useAppTheme();
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
		<Pressable
			style={[
				appStyles.button,
				{
					backgroundColor:
						variant === 'secondary' ? theme.background.a40 : theme.primary,
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
			onPress={onPress}
			onLongPress={onLongPress}
			disabled={disabled}
		>
			{loading && <ActivityIndicator size="small" color={'black'} />}
			{iconId ? (
				<AppIcon
					id={iconId as any}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					containerStyle={{ marginRight: 6 }}
				/>
			) : (
				<View />
			)}
			<NativeTextBold
				style={[
					{
						color:
							variant === 'secondary' ? theme.secondary.a10 : theme.primaryText,
						// opacity: 1,
						fontSize: 16,
						textAlign: 'center',
						marginLeft: loading ? 8 : 0,
					},
					textStyle,
				]}
			>
				{label}
			</NativeTextBold>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: appDimensions.buttons.borderRadius,
		paddingVertical: 8,
	},
});

type AppButtonClassicInvertedProps = {
	label: string;
	onClick: () => void;
};

export function AppButtonClassicInverted({
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
}

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
export function AppButtonBottomSheetAction({
	label,
	onPress,
	Icon,
	loading,
	type,
	style,
	disabled,
}: AppButtonBottomSheetActionProps) {
	const { theme } = useAppTheme();
	const bgColor: Record<APP_BOTTOM_SHEET_ACTION_CATEGORY, string> = {
		[APP_BOTTOM_SHEET_ACTION_CATEGORY.CANCEL]: theme.complementary,
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
				<NativeTextBold
					style={{
						color: disabled ? APP_FONT.DISABLED : APP_FONT.MONTSERRAT_BODY,
					}}
				>
					{label}
				</NativeTextBold>
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
}

type AppCtaButtonProps = {
	label: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
};

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
		cta: theme.primary,
		info: theme.background.a20,
		warn: 'orange',
		warm: 'transparent',
	};

	const fgColor: Record<ButtonVariant, string> = {
		blank: 'transparent',
		error: 'red',
		cta: theme.primaryText,
		info: theme.complementary,
		warn: 'orange',
		warm: theme.primary,
	};

	if (variant === 'blank') return <View style={[styles.button, style]} />;

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.button,
				{
					backgroundColor: bgColor[variant],
					paddingHorizontal: 16,
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
