import { memo, useMemo } from 'react';
import { View, Image } from 'react-native';
import { Text } from '@rneui/themed';
import Octicons from '@expo/vector-icons/Octicons';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import useMfm from '../../../../hooks/useMfm';
import { Props, styles, ICON_SIZE } from './_common';
import { APP_FONTS } from '../../../../../styles/AppFonts';

const MentionNotificationFragment = memo(function Foo({ item }: Props) {
	const { subdomain } = useActivityPubRestClientContext();
	const acct = item.acct;
	const post = item.post;

	const { content } = useMfm({
		content: post.getContent(),
		remoteSubdomain: acct.getInstanceUrl(),
		emojiMap: acct.getEmojiMap(),
		deps: [post.getContent()],
		expectedHeight: 20,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	});

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(
			acct?.getAccountUrl(subdomain),
			subdomain,
		);
	}, [acct?.getAccountUrl()]);

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row' }}>
				<View
					style={{ width: ICON_SIZE, height: ICON_SIZE, position: 'relative' }}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: acct.getAvatarUrl(),
						}}
						style={{ width: ICON_SIZE, height: ICON_SIZE, borderRadius: 8 }}
					/>
					<View
						style={[
							styles.notificationCategoryIconContainer,
							{ backgroundColor: 'purple' },
						]}
					>
						<Octicons
							name="mention"
							size={16}
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
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: APP_FONT.MONTSERRAT_BODY,
							fontSize: 12,
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
