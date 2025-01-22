import { Account, ProfilePinnedTag } from '../../../database/_schema';
import { StyleSheet, View } from 'react-native';
import PinnedTagView from '../views/PinnedTagView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';

type Props = {
	items: ProfilePinnedTag[];
	parentAcct: Account;
	onPressAddTag: () => void;
	onLongPressTag: (pinnedTag: ProfilePinnedTag) => void;
};

function TagListPresenter({
	items,
	parentAcct,
	onPressAddTag,
	onLongPressTag,
}: Props) {
	function onPress(item: ProfilePinnedTag) {}

	function onLongPress(item: ProfilePinnedTag) {
		onLongPressTag(item);
	}

	return (
		<HubTabSectionContainer
			label={'Tags'}
			style={{
				marginTop: 16,
			}}
			onPressAdd={onPressAddTag}
		>
			<View style={styles.pinnedTagListContainer}>
				{items.map((tag, i) => (
					<PinnedTagView
						key={i}
						item={tag}
						onPress={onPress}
						onLongPress={onLongPress}
					/>
				))}
			</View>
		</HubTabSectionContainer>
	);
}

export default TagListPresenter;

const styles = StyleSheet.create({
	root: {
		marginTop: 16,
		marginHorizontal: 8,
	},
	pinnedTagListContainer: {
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflow: 'hidden',
	},
});
