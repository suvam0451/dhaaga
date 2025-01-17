import { Pressable, View, Text } from 'react-native';
import { APP_ICON_ENUM, AppIcon } from '../../../components/lib/Icon';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../../styles/AppFonts';

type CollectionItemProps = {
	active: boolean;
	activeIconId: APP_ICON_ENUM;
	inactiveIconId: APP_ICON_ENUM;
	activeTint: string;
	inactiveTint: string;
	label: string;
	desc: string[];
	onPress: () => void;
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
}: CollectionItemProps) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				marginBottom: 16,
				alignItems: 'center',
				paddingRight: 4,
			}}
		>
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
			<View style={{ marginLeft: 16, justifyContent: 'center' }}>
				<Text
					style={{
						color: theme.secondary.a0,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 18,
					}}
				>
					{label}
				</Text>
				<Text
					style={{
						color: theme.secondary.a20,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
					}}
				>
					{desc.join(' · ')}
				</Text>
			</View>
			<View style={{ flexGrow: 1 }} />
			<Pressable onPress={onPress}>
				{active ? (
					<AppIcon
						id={activeIconId}
						size={32}
						color={activeTint}
						onPress={onPress}
					/>
				) : (
					<AppIcon
						id={inactiveIconId}
						size={32}
						color={inactiveTint}
						onPress={onPress}
					/>
				)}
			</Pressable>
		</View>
	);
}

export default CollectionItem;
