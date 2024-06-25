import { useActivitypubUserContext } from '../../../states/useProfile';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@rneui/themed';
import useMfm from '../../hooks/useMfm';
import { extractInstanceUrl } from '../../../utils/instances';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { APP_FONT } from '../../../styles/AppTheme';

/**
 *
 * @constructor
 */
function ReplyOwner() {
	const { user } = useActivitypubUserContext();
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const subdomain = primaryAcct?.subdomain;

	const { content: UsernameWithEmojis } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
	});

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
				<Image
					style={{
						flex: 1,
						width: '100%',
						// backgroundColor: '#0553',
						// padding: 1,
						opacity: 0.87,
						borderRadius: 8,
					}}
					source={{ uri: user?.getAvatarUrl() }}
					placeholder={{ blurhash: user?.getAvatarBlurHash() }}
				/>
			</View>
			<View style={{ marginLeft: 8 }}>
				<Text>{UsernameWithEmojis}</Text>
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY, fontSize: 12 }}>
					{extractInstanceUrl(
						user?.getAccountUrl(),
						user?.getUsername(),
						subdomain,
					)}
				</Text>
			</View>
		</View>
	);
}

export default ReplyOwner;
