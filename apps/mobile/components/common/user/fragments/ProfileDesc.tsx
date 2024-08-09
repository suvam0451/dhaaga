import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { EmojiMapValue } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/profile/_interface';

type ProfileDescProps = {
	rawContext: string;
	remoteSubdomain: string;
	style: StyleProp<ViewStyle>;
};

/**
 * A mfm renderer component for
 * the profile's description
 */
const ProfileDesc = memo(
	({ rawContext, remoteSubdomain, style }: ProfileDescProps) => {
		const { content } = useMfm({
			content: rawContext,
			remoteSubdomain,
			emojiMap: new Map<string, EmojiMapValue>(),
			deps: [rawContext],
			fontFamily: APP_FONTS.INTER_500_MEDIUM,
		});

		return <View style={style}>{content}</View>;
	},
);

export default ProfileDesc;
