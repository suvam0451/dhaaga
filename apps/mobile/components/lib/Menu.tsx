import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import APP_ICON_ENUM, { AppIcon } from './Icon';
import { useAppTheme } from '#/states/global/hooks';
import { Loader } from './Loader';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { appDimensions } from '#/styles/dimensions';
import { AppText } from './Text';

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
	const { theme } = useAppTheme();

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
		const { theme } = useAppTheme();

		const _label = active ? activeLabel || label : label;
		const _desc = active ? activeDesc || desc : desc;

		return (
			<Pressable
				style={{
					flexDirection: 'row',
					// padding: 8,
					paddingVertical: _desc ? 10 : 12,
					alignItems: 'center',
					width: '100%',
					minHeight: 48,
				}}
				onPress={onPress}
			>
				<View>{appIconId}</View>
				<View
					style={{
						marginLeft: 12,
						paddingRight: 4,
					}}
				>
					<AppText.Medium
						style={{
							color: theme.secondary.a10,
							fontSize: 18,
							marginBottom: _desc
								? appDimensions.timelines.sectionBottomMargin * 0.5
								: 0,
						}}
					>
						{_label}
					</AppText.Medium>
					{_desc && (
						<AppText.Normal
							style={{
								color: theme.secondary.a30,
							}}
						>
							{_desc}
						</AppText.Normal>
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

type AppBottomSheetMenuHeaderProps = {
	title: string;
	desc?: string;
	menuItems: {
		iconId: string;
		onPress: () => void;
	}[];
};

/**
 *
 * @constructor
 */
export class AppBottomSheetMenu {
	static Header({ title, menuItems }: AppBottomSheetMenuHeaderProps) {
		const { theme } = useAppTheme();
		return (
			<View
				style={{
					marginVertical: 16,
					justifyContent: 'space-between',
					flexDirection: 'row',
					marginHorizontal: 16,
					alignItems: 'center',
					marginTop: 32,
				}}
			>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_700_BOLD,
						color: theme.textColor.high,
						fontSize: 20,
						flex: 1,
					}}
				>
					{title}
				</Text>
				<View>
					{menuItems.map((o, i) => (
						<Pressable
							key={i}
							style={{
								paddingHorizontal: 8,
							}}
							onPress={o.onPress}
						>
							<AppIcon
								id={o.iconId as APP_ICON_ENUM}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								onPress={o.onPress}
							/>
						</Pressable>
					))}
				</View>
			</View>
		);
	}

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
			<View
				style={[
					styles.cancelButtonContainer,
					{ backgroundColor: theme.background.a30 },
					style,
				]}
			>
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
						{backLabel || 'Back'}
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
						<AppText.Medium
							style={{
								color: nextEnabled ? theme.primary.a0 : theme.secondary.a20,
								fontSize: 16,
								textAlign: 'right',
								marginLeft: 'auto',
							}}
						>
							{nextLabel}
						</AppText.Medium>
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
		paddingTop: appDimensions.bottomSheet.clearanceTop,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
	},
});
