import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ICON_ENUM, AppIcon } from './Icon';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { Loader } from './Loader';

type AppMenuOptionType = {
	appIconId: any;
	label: string;
	desc?: string;
	onPress: () => void;
	// active state highlighting
	active?: boolean;
	activeLabel?: string;
	activeDesc?: string;
};

type AppMenuOptionType_New = {
	appIconId: APP_ICON_ENUM;
	label: string;
	desc?: string;
	onPress: () => void;
	// active state highlighting
	active?: boolean;
	activeLabel?: string;
	activeDesc?: string;
};

export function AppMenuItem({
	appIconId,
	label,
	desc,
	onPress,
	active,
	activeLabel,
	activeDesc,
}: AppMenuOptionType_New) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const _label = active ? activeLabel || label : label;
	const _desc = active ? activeDesc || desc : desc;

	return (
		<Pressable
			style={{
				flexDirection: 'row',
				padding: 8,
				alignItems: 'center',
				width: '100%',
				minHeight: 64,
			}}
			onPress={onPress}
		>
			<AppIcon id={appIconId} size={24} color={theme.complementary.a0} />
			<View
				style={{
					marginLeft: 12,
					paddingRight: 4,
				}}
			>
				<Text
					style={{
						color: theme.secondary.a10,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 18,
						marginBottom: 2,
					}}
				>
					{_label}
				</Text>
				{desc && (
					<Text
						style={{
							color: theme.secondary.a30,
							flexWrap: 'wrap',
						}}
					>
						{_desc}
					</Text>
				)}
			</View>
		</Pressable>
	);
}
export class AppMenu {
	static Option({
		appIconId,
		label,
		desc,
		onPress,
		active,
		activeLabel,
		activeDesc,
	}: AppMenuOptionType) {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		const _label = active ? activeLabel || label : label;
		const _desc = active ? activeDesc || desc : desc;

		return (
			<Pressable
				style={{
					flexDirection: 'row',
					padding: 8,
					paddingVertical: _desc ? 10 : 12,
					alignItems: 'center',
					width: '100%',
					minHeight: 48,
				}}
				onPress={onPress}
			>
				{appIconId}
				<View
					style={{
						marginLeft: 12,
						paddingRight: 4,
					}}
				>
					<Text
						style={{
							color: theme.secondary.a10,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 18,
							marginBottom: _desc ? 0 : 2,
						}}
					>
						{_label}
					</Text>
					{_desc && (
						<Text
							style={{
								color: theme.secondary.a30,
								flexWrap: 'wrap',
							}}
						>
							{_desc}
						</Text>
					)}
				</View>
			</Pressable>
		);
	}
}

type AppBottomSheetMenuWithBackNavigationProps = {
	onBack: () => void;
	onNext: () => void;
	nextLabel: string;
	backLabel: string;
	nextEnabled: boolean;
	MiddleComponent?: any;
	style?: StyleProp<ViewStyle>;
	nextLoading?: boolean;
};

/**
 *
 * @constructor
 */
export class AppBottomSheetMenu {
	static WithBackNavigation({
		onBack,
		onNext,
		nextEnabled,
		MiddleComponent,
		style,
		nextLabel,
		backLabel,
		nextLoading,
	}: AppBottomSheetMenuWithBackNavigationProps) {
		const { theme } = useAppTheme();
		return (
			<View style={[styles.cancelButtonContainer, style]}>
				<Pressable
					onPress={onBack}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
						paddingVertical: 8,
					}}
				>
					<AppIcon id={'chevron-left'} color={theme.complementary.a0} />
					<Text
						style={{
							color: theme.complementary.a0,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 16,
						}}
					>
						{backLabel || 'Go Back'}
					</Text>
				</Pressable>
				<View
					style={{
						flexGrow: 1,
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{MiddleComponent}
				</View>
				{nextLoading ? (
					<View
						style={{
							flex: 1,
							alignItems: 'flex-end',
							marginRight: 16,
						}}
					>
						<Loader />
					</View>
				) : (
					<Pressable
						onPress={onNext}
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
							paddingRight: 8,
							flex: 1,
							paddingVertical: 8,
						}}
					>
						<Text
							style={{
								color: nextEnabled ? theme.primary.a0 : theme.secondary.a20,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								fontSize: 16,
								textAlign: 'right',
								marginLeft: 'auto',
							}}
						>
							{nextLabel}
						</Text>
					</Pressable>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cancelButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		maxWidth: '100%',
		marginBottom: 8,
		marginTop: 12,
	},
});
