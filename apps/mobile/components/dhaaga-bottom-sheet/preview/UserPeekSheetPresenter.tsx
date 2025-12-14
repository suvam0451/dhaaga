import { ScrollView, StyleSheet, View } from 'react-native';
import ProfileAvatar from '#/components/common/user/fragments/ProfileAvatar';
import UserRelationPresenter from '#/features/user-profiles/presenters/UserRelationPresenter';
import { appDimensions } from '#/styles/dimensions';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { Image } from 'expo-image';
import ProfileStatPresenter from '#/features/user-profiles/presenters/ProfileStatPresenter';
import { Skeleton } from '#/ui/Skeleton';
import { userProfileQueryOpts } from '@dhaaga/react';
import { useQuery } from '@tanstack/react-query';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { NativeTextMedium } from '#/ui/NativeText';
import TextAstRendererView from '#/ui/TextAstRendererView';

function Placeholder() {
	return (
		<View style={[styles.root, { overflow: 'hidden' }]}>
			<Skeleton height={128} width={'100%'} style={{ marginBottom: 12 }} />
			<Skeleton
				height={42}
				width={'75%'}
				style={{
					marginLeft: 'auto',
					marginBottom: 12,
					marginHorizontal: 10,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					paddingHorizontal: 10,
					marginBottom: 16,
				}}
			>
				<Skeleton
					height={42}
					width={'60%'}
					style={{ marginLeft: 'auto', flex: 1 }}
				/>
				<Skeleton
					height={42}
					width={'20%'}
					style={{ marginLeft: 12, marginBottom: 8 }}
				/>
			</View>
			{/*text*/}
			<Skeleton
				height={20}
				width={'100%'}
				style={{ marginLeft: 12, marginBottom: 8 }}
			/>
			<Skeleton
				height={20}
				width={'100%'}
				style={{ marginLeft: 12, marginBottom: 8 }}
			/>
			<Skeleton
				height={20}
				width={'40%'}
				style={{ marginLeft: 12, marginBottom: 8 }}
			/>
		</View>
	);
}

/**
 * This bottom sheet will show a preview
 * of the selected user's profile.
 */
function UserPeekSheetPresenter() {
	const { client } = useAppApiClient();
	const { ctx } = useAppBottomSheet();
	const { data, error, isLoading, isFetching } = useQuery(
		userProfileQueryOpts(client, ctx?.$type === 'user-preview' ? ctx : null),
	);
	const { theme } = useAppTheme();

	if (error)
		return (
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load profile data'}
				errorDescription={error.message}
			/>
		);
	if (isLoading || isFetching || !data) return <Placeholder />;

	return (
		<ScrollView
			style={styles.root}
			contentContainerStyle={{
				paddingBottom: 16,
			}}
		>
			{data?.banner ? (
				<Image source={{ uri: data?.banner }} style={styles.banner} />
			) : (
				<View style={styles.bannerReplacement} />
			)}
			<View style={styles.sectionA}>
				<ProfileAvatar
					containerStyle={styles.avatarContainer}
					imageStyle={styles.avatarImageContainer}
					uri={data?.avatarUrl}
				/>
				<ProfileStatPresenter
					acctId={data.id}
					followerCount={data.stats.followers}
					followingCount={data.stats.following}
					postCount={data.stats.posts}
					isPreview
				/>
			</View>
			<View style={styles.sectionB}>
				<View style={{ flex: 1 }}>
					<TextAstRendererView
						tree={data.parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={data.calculated.emojis}
					/>
					<NativeTextMedium
						numberOfLines={1}
						style={{
							color: theme.secondary.a40,
							fontSize: 13,
							maxWidth: 196,
						}}
					>
						{data?.handle}
					</NativeTextMedium>
				</View>
				<UserRelationPresenter userId={data?.id} />
			</View>
			<TextAstRendererView
				tree={data?.parsedDescription}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={data?.calculated?.emojis}
				style={{ paddingHorizontal: 10 }}
			/>
		</ScrollView>
	);
}

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;
const BORDER_RADIUS = appDimensions.bottomSheet.borderRadius;

const styles = StyleSheet.create({
	root: {
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		// overflow: 'hidden',
	},
	bannerReplacement: {
		height: 32,
		marginTop: appDimensions.bottomSheet.clearanceTop,
	},
	banner: {
		height: 128,
		flex: 1,
		borderTopLeftRadius: BORDER_RADIUS,
		borderTopRightRadius: BORDER_RADIUS,
	},
	sectionA: {
		flexDirection: 'row',
		marginBottom: MARGIN_BOTTOM,
	},
	avatarImageContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#0553',
		padding: 2,
		borderRadius: 8,
	},
	avatarContainer: {
		width: 72,
		height: 72,
		borderColor: 'gray',
		borderWidth: 0.75,
		borderRadius: 8,
		marginTop: -24,
		marginLeft: 6,
	},
	sectionB: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 8,
		marginRight: 8,
		marginBottom: MARGIN_BOTTOM,
	},
});

export default UserPeekSheetPresenter;
