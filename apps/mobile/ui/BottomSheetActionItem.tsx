import { useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';
import { TouchableOpacity, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type Props = {
	iconId: any;
	label: string;
	desc?: string;
	onPress: () => void;
	active?: boolean;
	size?: number;
};

function BottomSheetActionItem({
	iconId,
	label,
	desc,
	onPress,
	active,
	size,
}: Props) {
	const { theme } = useAppTheme();
	return (
		<TouchableOpacity
			style={{
				flexDirection: 'row',
				paddingVertical: 8,
				paddingHorizontal: 8,
				alignItems: 'center',
				width: '100%',
				minHeight: 52,
			}}
			onPress={onPress}
		>
			<View>
				<AppIcon
					id={iconId}
					color={active ? theme.primary : theme.secondary.a10}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					size={size ?? 24}
				/>
			</View>
			<View
				style={{
					marginLeft: 12,
					paddingRight: 4,
				}}
			>
				<NativeTextMedium
					style={{
						color: active ? theme.primary : theme.secondary.a10,
						fontSize: 18,
					}}
				>
					{label}
				</NativeTextMedium>
				{desc && (
					<NativeTextNormal
						style={{
							color: theme.secondary.a20,
							flexWrap: 'wrap',
						}}
					>
						{desc}
					</NativeTextNormal>
				)}
			</View>
		</TouchableOpacity>
	);
}

export default BottomSheetActionItem;
