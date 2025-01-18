import { Account, ProfilePinnedTag } from '../../../database/_schema';
import { StyleSheet, View } from 'react-native';
import PinnedTagView from '../views/PinnedTagView';
import { SocialHubPinSectionContainer } from '../../../components/screens/home/stack/landing/fragments/_factory';

type Props = {
	items: ProfilePinnedTag[];
	parentAcct: Account;
};

function PinnedTagListPresenter({ items, parentAcct }: Props) {
	function onPress(item: ProfilePinnedTag) {}

	function onLongPress(item: ProfilePinnedTag) {}

	return (
		<SocialHubPinSectionContainer
			label={'Tags'}
			style={{
				marginTop: 16,
			}}
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
		</SocialHubPinSectionContainer>
	);
}

export default PinnedTagListPresenter;

const styles = StyleSheet.create({
	pinnedTagListContainer: {
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflow: 'hidden',
	},
});
