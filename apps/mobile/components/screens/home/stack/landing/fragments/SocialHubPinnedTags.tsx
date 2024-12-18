import { useShallow } from 'zustand/react/shallow';
import { SocialHubPinSectionContainer } from './_factory';
import { StyleProp, View, ViewStyle, Text, StyleSheet } from 'react-native';
import useGlobalState from '../../../../../../states/_global';

type SocialHubPinnedTags = {
	style: StyleProp<ViewStyle>;
};
function SocialHubPinnedTags({ style }: SocialHubPinnedTags) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const items = ['DhaagaApp', 'DhaagaUpdates', 'DhaagaDev'];
	return (
		<SocialHubPinSectionContainer label={'Tags'} style={style}>
			<View
				style={{
					flexWrap: 'wrap',
					display: 'flex',
					flexDirection: 'row',
					flexGrow: 1,
					overflow: 'hidden',
				}}
			>
				{items.map((tag, i) => (
					<View
						key={i}
						style={[
							styles.tagContainer,
							{ backgroundColor: theme.palette.menubar },
						]}
					>
						<Text
							numberOfLines={1}
							style={[styles.tagText, { color: theme.textColor.medium }]}
						>
							#{tag}
						</Text>
					</View>
				))}
			</View>
		</SocialHubPinSectionContainer>
	);
}

export default SocialHubPinnedTags;

const styles = StyleSheet.create({
	tagContainer: {
		padding: 8,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 8,
		marginRight: 4,
		flexShrink: 1,
	},
	tagText: {
		fontSize: 18,
		flexShrink: 1,
	},
});
