import { Pressable, Text, View } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ICON_ENUM, AppIcon } from './Icon';

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
					alignItems: 'center',
					width: '100%',
					minHeight: 64,
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
}
