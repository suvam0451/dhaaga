import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { Image } from 'expo-image';
import Octicons from '@expo/vector-icons/Octicons';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import useMfm from '../../../../hooks/useMfm';
import { Props } from './_common';

const MentionNotificationFragment = memo(function Foo({ item }: Props) {
	const { subdomain } = useActivityPubRestClientContext();
	const acct = item.items[0].account;
	const post = item.items[0].post;

	const { content } = useMfm({
		content: post.getContent(),
		remoteSubdomain: acct.getInstanceUrl(),
		emojiMap: acct.getEmojiMap(),
		deps: [post.getContent()],
		expectedHeight: 20,
		fontFamily: 'Montserrat-Bold',
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(acct?.getAccountUrl(), subdomain);
	}, [acct?.getAccountUrl()]);

	// console.log(item.items);
	return (
		<View style={{ marginLeft: 0, marginVertical: 8 }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ width: 42, height: 42, position: 'relative' }}>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: acct.getAvatarUrl(),
							blurhash: acct.getAvatarBlurHash(),
						}}
						style={{ width: 42, height: 42, borderRadius: 8 }}
					/>
					<View
						style={{
							position: 'absolute',
							zIndex: 99,
							backgroundColor: 'purple',
							bottom: -8,
							right: -8,
							padding: 3,
							borderRadius: 8,
						}}
					>
						<Octicons
							name="mention"
							size={20}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>
				<View style={{ marginLeft: 12 }}>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_HEADER,
						}}
					>
						{acct.getDisplayName()}
					</Text>
					<Text
						style={{
							fontFamily: 'Inter-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{handle}
					</Text>
				</View>
			</View>
			<View style={{ marginTop: 8 }}>{content}</View>
		</View>
	);
});

export default MentionNotificationFragment;
