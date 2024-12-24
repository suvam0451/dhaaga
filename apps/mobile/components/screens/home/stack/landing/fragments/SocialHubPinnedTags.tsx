import { useShallow } from 'zustand/react/shallow';
import { SocialHubPinSectionContainer } from './_factory';
import { StyleProp, View, ViewStyle, Text, StyleSheet } from 'react-native';
import useGlobalState from '../../../../../../states/_global';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import { ProfilePinnedTag } from '../../../../../../database/_schema';
import { Dispatch } from 'react';
import { socialHubTabReducerAction } from '../../../../../../states/reducers/social-hub-tab.reducer';

type SocialHubPinnedTagsProps = {
	items: ProfilePinnedTag[];
	refresh: () => void;
	isRefreshing: boolean;
	dispatch: Dispatch<socialHubTabReducerAction>;
	style: StyleProp<ViewStyle>;
};

function SocialHubPinnedTags({
	items,
	refresh,
	isRefreshing,
	dispatch,
	style,
}: SocialHubPinnedTagsProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
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
							style={[
								styles.tagText,
								{
									color: theme.complementary.a0,
								},
							]}
						>
							#{tag.name}
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
		padding: 6,
		borderRadius: 12,
		paddingHorizontal: 12,
		marginBottom: 8,
		marginRight: 8,
		flexShrink: 1,
	},
	tagText: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 16,
		flexShrink: 1,
	},
});
