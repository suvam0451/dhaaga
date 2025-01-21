import { Account, ProfilePinnedTag } from '../../../database/_schema';
import { StyleSheet, View } from 'react-native';
import PinnedTagView from '../views/PinnedTagView';
import HubTabSectionContainer from '../components/HubTabSectionContainer';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';

type Props = {
	items: ProfilePinnedTag[];
	parentAcct: Account;
};

function TagListPresenter({ items, parentAcct }: Props) {
	const { show } = useAppDialog();
	function onPress(item: ProfilePinnedTag) {}

	function onLongPress(item: ProfilePinnedTag) {}

	function onPressAdd() {
		show(
			{
				title: 'Add Hashtag',
				description: [
					'Tags can also be added when browsing timelines (by pressing the tag).',
				],
				actions: [],
			},
			'Name of the tag',
			(text: string) => {
				console.log(text);
			},
		);
	}

	return (
		<HubTabSectionContainer
			label={'Tags'}
			style={{
				marginTop: 16,
			}}
			onPressAdd={onPressAdd}
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
