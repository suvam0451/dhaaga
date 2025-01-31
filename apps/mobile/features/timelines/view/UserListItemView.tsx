import { AppUserObject } from '../../../types/app-user.types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Image, useImage } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppDivider } from '../../../components/lib/Divider';
import { appDimensions } from '../../../styles/dimensions';
import { useState } from 'react';
import ProfileStatView from '../../user-profiles/view/ProfileStatView';
import UserRelationPresenter from '../../user-profiles/presenters/UserRelationPresenter';
import { TextContentView } from '../../../components/common/status/TextContentView';

type SearchResultUserItemProps = {
	item: AppUserObject;
};

const ICON_SIZE = 42;

type BannerProps = {
	uri: string;
};

function Banner({ uri }: BannerProps) {
	const image = useImage(uri, { maxHeight: 256 });
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
				marginBottom: appDimensions.timelines.sectionBottomMargin * 3,
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

function UserListItemView({ item }: SearchResultUserItemProps) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.userResultContainer}>
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
						marginBottom: appDimensions.timelines.sectionBottomMargin,
						alignItems: 'center',
					}}
				>
					<View>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{ uri: item.avatarUrl }}
							style={{
								width: ICON_SIZE,
								height: ICON_SIZE,
								borderRadius: ICON_SIZE / 2,
							}}
						/>
					</View>
					<View style={{ marginLeft: 12, maxWidth: '50%' }}>
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
					tree={item.parsedDisplayName}
					variant={'bodyContent'}
					mentions={[]}
					emojiMap={item.calculated.emojis}
				/>
				<AppDivider.Hard
					style={{
						marginVertical: appDimensions.timelines.sectionBottomMargin * 0.5,
						backgroundColor: '#323232',
					}}
				/>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{ flex: 1 }}>
						<ProfileStatView
							userId={item.id}
							postCount={item.stats.posts}
							followingCount={item.stats.following}
							followerCount={item.stats.followers}
							style={{ marginLeft: 0 }}
						/>
					</View>
					<UserRelationPresenter userId={item.id} />
				</View>
			</View>
		</View>
	);
}

export default UserListItemView;

const styles = StyleSheet.create({
	userResultContainer: {
		borderRadius: 12,
		backgroundColor: '#1f1f1f',
		margin: 6,
		marginBottom: 12,
	},
});
