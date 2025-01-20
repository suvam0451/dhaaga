import { ProfilePinnedTag } from '../../../database/_schema';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	item: ProfilePinnedTag;
	onPress: (item: ProfilePinnedTag) => void;
	onLongPress: (item: ProfilePinnedTag) => void;
};

function PinnedTagView({ item, onPress, onLongPress }: Props) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={[styles.tagContainer, { backgroundColor: theme.palette.menubar }]}
			onPress={() => {
				onPress(item);
			}}
			onLongPress={() => {
				onLongPress(item);
			}}
		>
			<AppText.Medium
				numberOfLines={1}
				style={[
					{
						fontSize: 16,
						flexShrink: 1,
						color: theme.complementary.a0,
					},
				]}
			>
				#{item.name}
			</AppText.Medium>
		</Pressable>
	);
}

export default PinnedTagView;

const styles = StyleSheet.create({
	tagContainer: {
		padding: 6,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 8,
		marginRight: 8,
		flexShrink: 1,
	},
});
