import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AccountCollection } from '@dhaaga/db';
import { AppText } from '../../../components/lib/Text';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { useTranslation } from 'react-i18next';

type Props = {
	item: AccountCollection;
	onPress: () => void;
	onLongPress: () => void;
};

function CollectionListItemView({ onPress, onLongPress, item }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<Pressable style={styles.root} onPress={onPress} onLongPress={onLongPress}>
			<View
				style={[
					styles.iconContainer,
					{
						borderColor: theme.secondary.a50,
					},
				]}
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
					{item.desc || t(`collections.fallbackDesc`)}
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

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		marginBottom: 16,
		alignItems: 'center',
		paddingRight: 4,
	},
	iconContainer: {
		padding: 16,
		borderWidth: 2,
		borderRadius: 12,
	},
});
