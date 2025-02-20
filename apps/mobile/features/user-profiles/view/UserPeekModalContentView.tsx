import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { AppText } from '../../../components/lib/Text';
import { Image } from 'expo-image';
import UserRelationPresenter from '../presenters/UserRelationPresenter';
import { UserObjectType } from '@dhaaga/core';
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
	user: UserObjectType;
};

function UserPeekModalContentView({ toProfile, user }: Props) {
	const { theme } = useAppTheme();

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
			{/*@ts-ignore-next-line*/}
			<Image
				source={{ uri: user.banner }}
				style={{
					width: '100%',
					height: 128,
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: 16,
					paddingHorizontal: 16,
				}}
			>
				<View style={{ flexGrow: 1, flex: 1 }}>
					<View
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							flexDirection: 'row',
						}}
					>
						<View style={{ flex: 1 }}>
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
									marginBottom: appDimensions.timelines.sectionBottomMargin,
								}}
								numberOfLines={1}
							>
								{user.handle}
							</AppText.Medium>
							<View
								style={{
									flexDirection: 'row',
								}}
							>
								<Text>
									<AppText.SemiBold
										style={{ color: theme.secondary.a20, fontSize: 16 }}
									>
										{util(user.stats.followers)}
									</AppText.SemiBold>
									<AppText.Medium
										style={{ color: theme.secondary.a20, fontSize: 13 }}
									>
										{' '}
										followers
									</AppText.Medium>
								</Text>
							</View>
						</View>
						<View
							style={{
								borderRadius: '100%',
								overflow: 'hidden',
								width: 64,
								height: 64,
								marginTop: -24,
								borderColor: 'rgba(100, 100, 100, 0.5)',
								borderWidth: 2,
							}}
						>
							{/*@ts-ignore-next-line*/}
							<Image
								source={{ uri: user.avatarUrl }}
								style={{
									width: 64,
									height: 64,
									borderRadius: '100%',
								}}
							/>
						</View>
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
							fontSize: 15,
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
