import { ProfilePinnedTag } from '@dhaaga/db';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	item: ProfilePinnedTag;
	onPress: (item: ProfilePinnedTag) => void;
	onLongPress: (item: ProfilePinnedTag) => void;
};

function PinnedTagView({ item, onPress, onLongPress }: Props) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={[styles.tagContainer, { backgroundColor: theme.background.a30 }]}
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
						color: theme.complementary,
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
