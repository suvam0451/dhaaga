import { Pressable, View } from 'react-native';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { AppText } from '#/components/lib/Text';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type MenuItemProps = {
	appIconId: any;
	label: string;
	description?: string;
	onPress: () => void;
	// active state highlighting
	active?: boolean;
	activeLabel?: string;
	activeDesc?: string;
};

function MenuItem({
	appIconId,
	label,
	description,
	onPress,
	active,
	activeLabel,
	activeDesc,
}: MenuItemProps) {
	const { theme } = useAppTheme();

	const _label = active ? (activeLabel ?? label) : label;
	const _desc = active ? (activeDesc ?? description) : description;

	return (
		<View
			style={{
				flexDirection: 'row',
				// padding: 8,
				paddingVertical: _desc ? 10 : 16,
				alignItems: 'center',
				width: '100%',
				minHeight: 48,
			}}
		>
			<View>
				<AppIcon id={appIconId} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
			</View>
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
		</View>
	);
}

type Props = {
	items: MenuItemProps[];
};

function BottomSheetActionMenuBuilder({ items }: Props) {
	return (
		<View style={{ marginTop: 8, paddingHorizontal: 10 }}>
			{items.map((item, i) => (
				<Pressable onPress={item.onPress} key={i}>
					<MenuItem {...item} />
				</Pressable>
			))}
		</View>
	);
}

export default BottomSheetActionMenuBuilder;
