import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { visibilityIcon } from '../../utils/instances';
import { formatDistanceToNowStrict } from 'date-fns';
import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useActivitypubStatusContext } from '../../states/useStatus';
import { useActivitypubUserContext } from '../../states/useProfile';
import { Skeleton } from '@rneui/themed';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { APP_FONT } from '../../styles/AppTheme';
import useMfm from '../hooks/useMfm';
import AstService from '../../services/ast.service';
import { ActivitypubHelper } from '@dhaaga/shared-utility-html-parser/src';

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

export function OriginalPostedPfpFragment({
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
}

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

export function OriginalPosterPostedByFragment({
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
				<View>{UsernameWithEmojis}</View>
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
}

function OriginalPoster({
	id,
	avatarUrl,
	createdAt,
	accountUrl,
	visibility,
}: OriginalPosterProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;

	const navigation = useNavigation<any>();
	const { status } = useActivitypubStatusContext();
	const { user, setDataRaw } = useActivitypubUserContext();

	useEffect(() => {
		if (status?.getUser()) return;
		setDataRaw(status?.getUser());
	}, [status]);

	const { content: UsernameWithEmojis } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
	});

	const UsernameStyled =
		AstService.applyTextStylingToChildren(UsernameWithEmojis);

	const onProfileClicked = useCallback(() => {
		navigation.navigate('Profile', {
			id: id,
		});
	}, []);

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(accountUrl, subdomain);
	}, [accountUrl]);

	return useMemo(() => {
		if (!user) return <OriginalPosterSkeleton />;
		return (
			<Fragment>
				<OriginalPostedPfpFragment url={avatarUrl} onClick={onProfileClicked} />
				{/*TODO: replace the remaining component with this*/}
				{/*<OriginalPosterPostedByFragment*/}
				{/*	onClick={onProfileClicked}*/}
				{/*	theirSubdomain={user?.getInstanceUrl()}*/}
				{/*	displayNameRaw={user?.getDisplayName()}*/}
				{/*	instanceUrl={extractInstanceUrl(accountUrl, username, subdomain)}*/}
				{/*	postedAt={new Date(status?.getCreatedAt())}*/}
				{/*	visibility={status?.getVisibility()}*/}
				{/*/>*/}
				<View
					style={{
						display: 'flex',
						marginLeft: 8,
						flexGrow: 1,
						maxWidth: '100%',
					}}
				>
					<TouchableOpacity onPress={onProfileClicked}>
						<View>
							<Text
								style={{
									color: APP_FONT.MONTSERRAT_HEADER,
									fontFamily: 'Inter-SemiBold',
									maxWidth: 196,
									marginTop: -3,
								}}
								numberOfLines={1}
							>
								{UsernameStyled}
							</Text>
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
							{handle}
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
							{formatDistanceToNowStrict(new Date(createdAt), {
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
			</Fragment>
		);
	}, [user, UsernameWithEmojis]);
}

export default OriginalPoster;
