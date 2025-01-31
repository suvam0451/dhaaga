import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, View } from 'react-native';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AccountCollection } from '../../../database/_schema';
import { AppText } from '../../../components/lib/Text';

type ReadOnlyViewProps = {
	item: AccountCollection;
	onPress: () => void;
	onLongPress: () => void;
};

function CollectionListItemView({
	onPress,
	onLongPress,
	item,
}: ReadOnlyViewProps) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={{
				flexDirection: 'row',
				marginBottom: 16,
				alignItems: 'center',
				paddingRight: 4,
			}}
			onPress={onPress}
			onLongPress={onLongPress}
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
				<AppText.SemiBold
					style={{
						fontSize: 18,
						color: theme.primary.a0,
					}}
				>
					{item.alias}
				</AppText.SemiBold>
				<AppText.Normal
					style={{
						color: theme.secondary.a20,
					}}
				>
					Local Only Not Synced
				</AppText.Normal>
			</View>

			<View style={{ flexGrow: 1 }} />
			<AppIcon
				id={'chevron-right'}
				size={32}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				onPress={() => {}}
			/>
		</Pressable>
	);
}

export default CollectionListItemView;
