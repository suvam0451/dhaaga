import {
	Pressable,
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
} from 'react-native';
import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import { NativeTextBold } from '#/ui/NativeText';

type CollectionItemProps = {
	active: boolean;
	activeIconId: APP_ICON_ENUM;
	inactiveIconId: APP_ICON_ENUM;
	activeTint: string;
	inactiveTint: string;
	label: string;
	desc: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
};

/**
 * Row item representing a collection/bookmark
 * set and whether the object belongs in it
 * @param label
 * @param desc
 * @param active
 * @param activeTint
 * @param inactiveTint
 * @param inactiveIconId
 * @param activeIconId
 * @param onPress
 * @param style
 * @constructor
 */
function CollectionItem({
	label,
	desc,
	active,
	activeTint,
	inactiveTint,
	inactiveIconId,
	activeIconId,
	onPress,
	style,
}: CollectionItemProps) {
	const { theme } = useAppTheme();

	return (
		<View style={[styles.root, style]}>
			<View
				style={{
					padding: 16,
					borderWidth: 2,
					borderRadius: 12,
					borderColor: theme.secondary.a50,
				}}
			>
				<AppIcon id={'albums-outline'} size={24} color={theme.secondary.a20} />
			</View>
			<View style={{ marginLeft: 16, justifyContent: 'center', flex: 1 }}>
				<NativeTextBold
					style={{
						color: active ? theme.primary : theme.secondary.a10,
						fontSize: 18,
						marginBottom: 4,
					}}
					numberOfLines={1}
				>
					{label}
				</NativeTextBold>
				<NativeTextBold
					style={{
						color: theme.secondary.a30,
					}}
					numberOfLines={1}
				>
					{desc}
				</NativeTextBold>
			</View>
			<Pressable onPress={onPress} style={{ padding: 8 }}>
				{active ? (
					<AppIcon id={activeIconId} size={32} color={activeTint} />
				) : (
					<AppIcon id={inactiveIconId} size={32} color={inactiveTint} />
				)}
			</Pressable>
		</View>
	);
}

export default CollectionItem;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 4,
		flex: 1,
	},
});
