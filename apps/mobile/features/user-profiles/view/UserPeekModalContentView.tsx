import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import { Image } from 'expo-image';
import UserRelationPresenter from '../presenters/UserRelationPresenter';
import { AppUserObject } from '../../../types/app-user.types';
import { TextContentView } from '../../../components/common/status/TextContentView';

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

type Props = {
	toProfile: () => void;
	user: AppUserObject;
};

function UserPeekModalContentView({ toProfile, user }: Props) {
	const { theme } = useAppTheme();

	return (
		<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
			<View style={{ flexDirection: 'row', marginBottom: 16 }}>
				<View style={{ flexGrow: 1, flex: 1 }}>
					<View
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
						}}
					>
						<TextContentView
							oneLine
							tree={user.parsedDisplayName}
							variant={'displayName'}
							mentions={[]}
							emojiMap={user.calculated.emojis}
						/>
						<AppText.Medium
							style={{
								color: theme.secondary.a30,
								fontSize: 12,
							}}
							numberOfLines={1}
						>
							{user.handle}
						</AppText.Medium>
					</View>

					<View
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							width: '100%',
						}}
					>
						<TextContentView
							tree={user.parsedDescription}
							variant={'bodyContent'}
							mentions={[]}
							emojiMap={user.calculated.emojis}
						/>
					</View>
				</View>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						width: 72,
						height: 72,
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: user.avatarUrl }}
						style={{
							width: 72,
							height: 72,
							borderRadius: '100%',
						}}
					/>
				</View>
			</View>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				<Text>
					<AppText.SemiBold
						style={{ color: theme.complementary.a0, fontSize: 16 }}
					>
						{util(user.stats.followers)}
					</AppText.SemiBold>
					<AppText.Medium
						style={{ color: theme.complementary.a0, fontSize: 14 }}
					>
						{' '}
						Followers
					</AppText.Medium>
				</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					marginTop: 8,
				}}
			>
				<View style={{ flex: 1 }}>
					<UserRelationPresenter userId={user.id} />
				</View>
				<Pressable
					style={{
						paddingHorizontal: 4,
						flex: 1,
						alignItems: 'center',
					}}
					onPress={toProfile}
				>
					<AppText.SemiBold
						style={{
							textAlign: 'center',
							alignSelf: 'center',
							margin: 'auto',
							fontSize: 16,
						}}
						color={theme.primary.a0}
					>
						Show Profile
					</AppText.SemiBold>
				</Pressable>
			</View>
		</ScrollView>
	);
}

export default UserPeekModalContentView;
