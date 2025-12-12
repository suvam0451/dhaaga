import type { UserObjectType } from '@dhaaga/bridge';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { Image, useImage } from 'expo-image';
import { APP_FONTS } from '#/styles/AppFonts';
import { appDimensions } from '#/styles/dimensions';
import { useState } from 'react';
import ProfileStatView from '../../user-profiles/view/ProfileStatView';
import UserRelationPresenter from '../../user-profiles/presenters/UserRelationPresenter';
import { TextContentView } from '#/components/common/status/TextContentView';
import { AppDividerHard } from '#/ui/Divider';

const ICON_SIZE = 42;
const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type BannerProps = {
	uri: string;
};

function Banner({ uri }: BannerProps) {
	const image = useImage(uri, { maxHeight: 128 });
	const [ImageDims, setImageDims] = useState({
		width: Dimensions.get('window').width,
		height: 128,
	});

	const handleLayout = (event) => {
		const { width } = event.nativeEvent.layout; // Extract width from the layout event
		setImageDims({
			width,
			height: Math.min(128, (image.width / width) * image.height),
		});
	};

	if (!image) return <View style={{ height: 128 }} />;
	return (
		<View
			style={{
				marginBottom: MARGIN_BOTTOM,
			}}
			onLayout={handleLayout}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				source={image}
				style={{
					width: ImageDims.width,
					height: ImageDims.height,
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8,
				}}
			/>
		</View>
	);
}

type Props = {
	item: UserObjectType;
};

function UserListItemDetailedView({ item }: Props) {
	const { theme } = useAppTheme();

	return (
		<View
			style={[
				styles.userResultContainer,
				{ backgroundColor: theme.background.a20 },
			]}
		>
			{item.banner && <Banner uri={item.banner} />}
			{!item.banner && <View style={{ height: 12 }} />}
			<View
				style={{
					paddingHorizontal: 10,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						marginBottom: MARGIN_BOTTOM,
						alignItems: 'center',
					}}
				>
					<Image
						source={{ uri: item.avatarUrl }}
						style={{
							width: ICON_SIZE,
							height: ICON_SIZE,
							borderRadius: ICON_SIZE / 2,
						}}
					/>
					<View style={{ marginLeft: 12, maxWidth: '75%' }}>
						<TextContentView
							tree={item.parsedDisplayName}
							variant={'displayName'}
							mentions={[]}
							emojiMap={item.calculated.emojis}
						/>
						<Text
							style={{
								color: theme.secondary.a30,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								fontSize: 13,
							}}
							numberOfLines={1}
						>
							{item.handle}
						</Text>
					</View>
					<View style={{ flexGrow: 1 }} />
				</View>
				<TextContentView
					tree={item.parsedDescription}
					variant={'bodyContent'}
					mentions={[]}
					emojiMap={item.calculated.emojis}
				/>
				<AppDividerHard
					style={{
						marginVertical: MARGIN_BOTTOM,
						backgroundColor: theme.background.a50,
					}}
				/>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<ProfileStatView
						userId={item.id}
						postCount={item.stats.posts}
						followingCount={item.stats.following}
						followerCount={item.stats.followers}
						style={{ flex: 1, marginLeft: 0 }}
					/>
					<UserRelationPresenter userId={item.id} />
				</View>
			</View>
		</View>
	);
}

/**
 * An alternative layout, since at proto
 * does not offer profile stats
 * @param props
 * @constructor
 */
function UserListItemViewBsky(props: Props) {}

/**
 * exclude banner and stats
 */
export default UserListItemDetailedView;

const styles = StyleSheet.create({
	userResultContainer: {
		borderRadius: 12,
		margin: 6,
		marginBottom: 12,
	},
});
