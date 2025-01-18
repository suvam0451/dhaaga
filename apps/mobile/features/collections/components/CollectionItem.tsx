import { Pressable, View } from 'react-native';
import { APP_ICON_ENUM, AppIcon } from '../../../components/lib/Icon';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';

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
				<AppText.Medium
					style={{
						color: theme.secondary.a10,
						fontSize: 18,
						marginBottom: 4,
					}}
				>
					{label}
				</AppText.Medium>
				<AppText.Medium
					style={{
						color: theme.secondary.a30,
					}}
				>
					{desc.join(' • ')}
				</AppText.Medium>
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
