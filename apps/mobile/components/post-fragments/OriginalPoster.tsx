import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { visibilityIcon } from '../../utils/instances';
import { formatDistanceToNowStrict } from 'date-fns';
import { Fragment, memo, useCallback, useEffect, useMemo } from 'react';
import { useActivitypubStatusContext } from '../../states/useStatus';
import { useActivitypubUserContext } from '../../states/useProfile';
import { Skeleton } from '@rneui/themed';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import useMfm from '../hooks/useMfm';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import useAppNavigator from '../../states/useAppNavigator';

type OriginalPosterProps = {
	id: string;
	createdAt: string;
	avatarUrl: string;
	displayName: string;
	accountUrl: string;
	username: string;
	subdomain?: string;
	visibility: string;
};

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
	emojiMap?: any;
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
		fontFamily: 'Montserrat-Bold',
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
				<Text
					style={{
						color: 'gray',
						fontSize: 12,
						fontFamily: 'Inter-Bold',
						opacity: 0.87,
					}}
				>
					{formatDistanceToNowStrict(postedAt, {
						addSuffix: false,
					})}
				</Text>
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
				{visibilityIcon(visibility)}
			</View>
		</View>
	);
});

const OriginalPoster = memo(function Foo({
	id,
	avatarUrl,
	accountUrl,
}: OriginalPosterProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;

	const { status, sharedStatus } = useActivitypubStatusContext();
	const { user, setDataRaw } = useActivitypubUserContext();

	const op = status?.isReposted() ? sharedStatus : status;
	const { toProfile } = useAppNavigator();

	useEffect(() => {
		if (status?.getUser()) return;
		setDataRaw(status?.getUser());
	}, [status]);

	const onProfileClicked = useCallback(() => {
		toProfile(id);
	}, [id]);

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(accountUrl, subdomain);
	}, [accountUrl]);

	return useMemo(() => {
		if (!user) return <OriginalPosterSkeleton />;
		return (
			<Fragment>
				<OriginalPostedPfpFragment url={avatarUrl} onClick={onProfileClicked} />
				<OriginalPosterPostedByFragment
					onClick={onProfileClicked}
					theirSubdomain={user?.getInstanceUrl()}
					displayNameRaw={user?.getDisplayName()}
					instanceUrl={handle}
					postedAt={new Date(op?.getCreatedAt())}
					visibility={status?.getVisibility()}
				/>
			</Fragment>
		);
	}, [user]);
});

export default OriginalPoster;
