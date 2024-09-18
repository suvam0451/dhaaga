import {
	StyleProp,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { memo, useCallback, useMemo } from 'react';
import { Skeleton } from '@rneui/themed';
import useMfm from '../../../hooks/useMfm';
import useAppNavigator from '../../../../states/useAppNavigator';
import StatusCreatedAt from './StatusCreatedAt';
import { APP_FONTS } from '../../../../styles/AppFonts';
import StatusVisibility from './StatusVisibility';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const TIMELINE_PFP_SIZE = 46;

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
		<TouchableOpacity
			onPress={onClick}
			style={{
				width: TIMELINE_PFP_SIZE,
				height: TIMELINE_PFP_SIZE,
				borderColor: 'rgba(200, 200, 200, 0.3)',
				borderWidth: 1,
				borderRadius: TIMELINE_PFP_SIZE / 2,
				marginTop: 2,
				flexShrink: 1,
			}}
		>
			{/* @ts-ignore */}
			<Image
				style={{
					flex: 1,
					backgroundColor: '#0553',
					padding: 2,
					borderRadius: TIMELINE_PFP_SIZE / 2,
					overflow: 'hidden',
				}}
				source={{ uri: url }}
			/>
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
		emphasis: 'high',
	});
	const { colorScheme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				flex: 1,
				alignItems: 'flex-start',
			}}
		>
			<View
				style={{
					marginLeft: 8,
					flex: 1,
				}}
			>
				<TouchableOpacity onPress={onClick}>
					<View>
						{UsernameWithEmojis ? UsernameWithEmojis : <Text> </Text>}
					</View>

					<Text
						style={{
							color: colorScheme.textColor.medium,
							fontSize: 12,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							maxWidth: 196,
						}}
						numberOfLines={1}
					>
						{instanceUrl}
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'flex-end',
					// flex: 1,
					justifyContent: 'flex-end',
				}}
			>
				<StatusVisibility visibility={visibility} />
				<Text
					style={{
						color: colorScheme.textColor.low,
						marginLeft: 2,
						marginRight: 2,
						opacity: 0.6,
					}}
				>
					•
				</Text>
				<View style={{ flexDirection: 'row' }}>
					<StatusCreatedAt
						from={postedAt}
						textStyle={{
							color: colorScheme.textColor.low,
							fontSize: 12,
							fontFamily: APP_FONTS.INTER_700_BOLD,
							opacity: 0.87,
						}}
					/>
				</View>
			</View>
		</View>
	);
});

type OriginalPosterProps = {
	dto: ActivityPubStatusAppDtoType;
	style?: StyleProp<ViewStyle>;
};

/**
 * This is the author indicator for
 * the bottom-most post item
 */
const PostCreatedBy = memo(({ dto, style }: OriginalPosterProps) => {
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
			<View
				style={[{ alignItems: 'center', flexDirection: 'row', flex: 1 }, style]}
			>
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
			</View>
		);
	}, [STATUS_DTO.postedBy, style]);
});

export default PostCreatedBy;
