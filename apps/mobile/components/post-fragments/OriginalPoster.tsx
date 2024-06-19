import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { extractInstanceUrl, visibilityIcon } from '../../utils/instances';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import MfmService from '../../services/mfm.service';
import { useActivitypubStatusContext } from '../../states/useStatus';
import { useActivitypubUserContext } from '../../states/useProfile';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { Skeleton } from '@rneui/themed';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { APP_FONT } from '../../styles/AppTheme';
import useMfm from '../hooks/useMfm';
import AstService from '../../services/ast.service';

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

function OriginalPoster({
	id,
	avatarUrl,
	createdAt,
	accountUrl,
	username,
	visibility,
}: OriginalPosterProps) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;

	const navigation = useNavigation<any>();
	const { status } = useActivitypubStatusContext();
	const { user, setDataRaw } = useActivitypubUserContext();

	useEffect(() => {
		if (status.getUser()) return;
		setDataRaw(status.getUser());
	}, [status]);

	const { content: UsernameWithEmojis } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
	});

	const UsernameStyled =
		AstService.applyTextStylingToChildren(UsernameWithEmojis);

	function onProfileClicked() {
		navigation.navigate('Profile', {
			id: id,
		});
	}

	return useMemo(() => {
		if (!user || !UsernameWithEmojis) return <OriginalPosterSkeleton />;
		return (
			<React.Fragment>
				<TouchableOpacity onPress={onProfileClicked}>
					<View
						style={{
							width: 52,
							height: 52,
							borderColor: 'gray',
							borderWidth: 2,
							borderRadius: 6,
						}}
					>
						<Image
							style={{
								flex: 1,
								width: '100%',
								backgroundColor: '#0553',
								padding: 2,
								opacity: 0.87,
								borderRadius: 4,
							}}
							source={{ uri: avatarUrl }}
						/>
					</View>
				</TouchableOpacity>
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
							{extractInstanceUrl(accountUrl, username, subdomain)}
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
			</React.Fragment>
		);
	}, [user, UsernameWithEmojis]);
}

export default OriginalPoster;
