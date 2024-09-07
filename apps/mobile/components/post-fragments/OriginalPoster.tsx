import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { Skeleton } from '@rneui/themed';
import useMfm from '../hooks/useMfm';
import useAppNavigator from '../../states/useAppNavigator';
import StatusCreatedAt from '../common/status/fragments/StatusCreatedAt';
import { APP_FONTS } from '../../styles/AppFonts';
import StatusVisibility from '../common/status/fragments/StatusVisibility';
import { ActivityPubStatusAppDtoType } from '../../services/ap-proto/activitypub-status-dto.service';

/**
 * Renders the user (poster)'s avatar
 */
export const OriginalPostedPfpFragment = memo(function Foo({
	url,
	onClick,
}: {
	url: string;
	onClick: () => void;
}) {
	return (
		<TouchableOpacity onPress={onClick}>
			<View
				style={{
					width: 52,
					height: 52,
					borderColor: 'gray',
					borderWidth: 2,
					borderRadius: 6,
					marginTop: 2,
				}}
			>
				{/* @ts-ignore */}
				<Image
					style={{
						flex: 1,
						width: '100%',
						backgroundColor: '#0553',
						padding: 2,
						opacity: 0.87,
						borderRadius: 4,
					}}
					source={{ uri: url }}
				/>
			</View>
		</TouchableOpacity>
	);
});

function OriginalPosterSkeleton() {
	return (
		<View style={{ width: '90%' }}>
			<View
				style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 0 }}
			>
				<Skeleton style={{ height: 52, width: 52, borderRadius: 4 }} />
				<View style={{ flexGrow: 1, marginRight: 16 }}>
					<Skeleton
						style={{
							height: 52,
							marginLeft: 8,
							borderRadius: 4,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

export const OriginalPosterPostedByFragment = memo(function Foo({
	displayNameRaw,
	onClick,
	theirSubdomain,
	emojiMap,
	instanceUrl,
	visibility,
	postedAt,
}: {
	displayNameRaw: string;
	theirSubdomain: string;
	onClick: () => void;
	emojiMap?: Map<string, string>;
	instanceUrl: string;
	visibility: string;
	postedAt: Date;
}) {
	const { content: UsernameWithEmojis } = useMfm({
		content: displayNameRaw,
		remoteSubdomain: theirSubdomain,
		emojiMap: emojiMap,
		deps: [displayNameRaw],
		expectedHeight: 20,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		numberOfLines: 1,
	});

	return (
		<View
			style={{
				display: 'flex',
				marginLeft: 8,
				flexGrow: 1,
				maxWidth: '100%',
			}}
		>
			<TouchableOpacity onPress={onClick}>
				<View style={{ minHeight: 16 }}>
					{UsernameWithEmojis ? UsernameWithEmojis : <Text> </Text>}
				</View>
			</TouchableOpacity>
			<View>
				<Text
					style={{
						color: '#888',
						fontWeight: '500',
						fontSize: 12,
						opacity: 0.6,
						fontFamily: 'Inter-Bold',
						maxWidth: 196,
					}}
					numberOfLines={1}
				>
					{instanceUrl}
				</Text>
			</View>
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				<StatusCreatedAt
					from={postedAt}
					textStyle={{
						color: 'gray',
						fontSize: 12,
						fontFamily: APP_FONTS.INTER_700_BOLD,
						opacity: 0.87,
					}}
				/>
				<Text
					style={{
						color: 'gray',
						marginLeft: 2,
						marginRight: 2,
						opacity: 0.6,
					}}
				>
					•
				</Text>
				<StatusVisibility visibility={visibility} />
			</View>
		</View>
	);
});

type OriginalPosterProps = {
	dto: ActivityPubStatusAppDtoType;
};

const OriginalPoster = memo(({ dto }: OriginalPosterProps) => {
	const { toProfile } = useAppNavigator();

	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	const onProfileClicked = useCallback(() => {
		toProfile(STATUS_DTO.postedBy.userId);
	}, [STATUS_DTO.postedBy.userId]);

	return useMemo(() => {
		if (!STATUS_DTO.postedBy) return <OriginalPosterSkeleton />;
		return (
			<Fragment>
				<OriginalPostedPfpFragment
					url={STATUS_DTO.postedBy.avatarUrl}
					onClick={onProfileClicked}
				/>
				<OriginalPosterPostedByFragment
					onClick={onProfileClicked}
					theirSubdomain={STATUS_DTO.postedBy.instance}
					displayNameRaw={STATUS_DTO.postedBy.displayName}
					instanceUrl={STATUS_DTO.postedBy.handle}
					postedAt={new Date(STATUS_DTO.createdAt)}
					visibility={STATUS_DTO.visibility}
					emojiMap={STATUS_DTO.calculated.emojis}
				/>
			</Fragment>
		);
	}, [STATUS_DTO.postedBy]);
});

export default OriginalPoster;
