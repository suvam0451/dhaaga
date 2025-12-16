import type { UserObjectType } from '@dhaaga/bridge';
import { FlatList, Image, Pressable, View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import { useAppTheme } from '#/states/global/hooks';
import TextAstRendererView from '#/ui/TextAstRendererView';

type Props = {
	suggestions: UserObjectType[];
	onPick: (item: UserObjectType) => void;
};

const AVATAR_ICON_SIZE = 36;

function SuggestedUserListView({ suggestions, onPick }: Props) {
	const { theme } = useAppTheme();
	return (
		<FlatList
			keyboardShouldPersistTaps={'always'}
			horizontal={true}
			data={suggestions}
			renderItem={({ item }) => (
				<Pressable
					style={{
						flexDirection: 'row',
						padding: 6,
						marginRight: 4,
						alignItems: 'center',
					}}
					onPress={() => {
						onPick(item);
					}}
				>
					<View
						style={{
							borderWidth: 1,
							borderColor: 'gray',
							borderRadius: AVATAR_ICON_SIZE / 2,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{
								uri: item.avatarUrl,
							}}
							style={{
								width: AVATAR_ICON_SIZE,
								height: AVATAR_ICON_SIZE,
								borderRadius: AVATAR_ICON_SIZE / 2,
							}}
						/>
					</View>
					<View style={{ justifyContent: 'center', marginLeft: 6 }}>
						<TextAstRendererView
							tree={item.parsedDisplayName}
							variant={'displayName'}
							mentions={[]}
							emojiMap={item.calculated.emojis}
							oneLine
						/>
						<AppText.Medium
							style={{
								color: theme.secondary.a30,
								fontSize: 13,
							}}
						>
							{item.handle}
						</AppText.Medium>
					</View>
				</Pressable>
			)}
			contentContainerStyle={{ paddingBottom: 4 }}
		/>
	);
}

export default SuggestedUserListView;
