import { memo, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_FONT } from '../../../../styles/AppTheme';
import styles from '../utils/styles';
import useMfm from '../../../hooks/useMfm';
import { ActivitypubHelper } from '@dhaaga/shared-abstraction-activitypub';
import { useActivitypubUserContext } from '../../../../states/useProfile';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';

type ProfileNameAndHandleProps = {
	style: StyleProp<ViewStyle>;
};
/**
 * Renders the profile's display
 * name and handle
 */
const ProfileNameAndHandle = memo(({ style }: ProfileNameAndHandleProps) => {
	const { subdomain } = useActivityPubRestClientContext();
	const { user } = useActivitypubUserContext();

	const handle = useMemo(() => {
		return ActivitypubHelper.getHandle(user?.getAccountUrl(), subdomain);
	}, [user?.getAccountUrl()]);

	const { content: ParsedDisplayName } = useMfm({
		content: user?.getDisplayName(),
		remoteSubdomain: user?.getInstanceUrl(),
		emojiMap: user?.getEmojiMap(),
		deps: [user?.getDisplayName()],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	return (
		<View style={style}>
			<Text
				style={{
					fontFamily: APP_FONTS.MONTSERRAT_900_BLACK,
					color: APP_FONT.MONTSERRAT_HEADER,
				}}
				numberOfLines={1}
			>
				{ParsedDisplayName}
			</Text>
			<Text style={styles.secondaryText} numberOfLines={1}>
				{handle}
			</Text>
		</View>
	);
});

export default ProfileNameAndHandle;
