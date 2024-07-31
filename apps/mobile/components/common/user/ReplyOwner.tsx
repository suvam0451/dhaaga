import { useActivitypubUserContext } from '../../../states/useProfile';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import useMfm from '../../hooks/useMfm';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { APP_FONT } from '../../../styles/AppTheme';
import { useMemo } from 'react';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { APP_FONTS } from '../../../styles/AppFonts';

/**
 *
 * @constructor
 */
function ReplyOwner() {
	const { user } = useActivitypubUserContext();
	const { primaryAcct } = useActivityPubRestClientContext();
	const subdomain = primaryAcct?.subdomain;

	const { content: UsernameWithEmojis } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(
			user.getAccountUrl(subdomain),
			subdomain,
		);
	}, [user]);

	return (
		<View style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
			<View
				style={{
					width: 42,
					height: 42,
					borderColor: 'gray',
					borderWidth: 1,
					borderRadius: 6,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					style={{
						flex: 1,
						width: '100%',
						opacity: 0.87,
						borderRadius: 8,
					}}
					source={{ uri: user?.getAvatarUrl() }}
					placeholder={{ blurhash: user?.getAvatarBlurHash() }}
				/>
			</View>
			<View style={{ marginLeft: 8 }}>
				{UsernameWithEmojis}
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 12,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					{handle}
				</Text>
			</View>
		</View>
	);
}

export default ReplyOwner;
