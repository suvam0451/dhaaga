import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { APP_FONTS } from '../../../../styles/AppFonts';

type ProfileDescProps = {
	rawContext: string;
	remoteSubdomain: string;
	style: StyleProp<ViewStyle>;
	acceptTouch?: boolean;
	emojiMap?: Map<string, string>;
};

/**
 * A mfm renderer component for
 * the profile's description
 */
const ProfileDesc = memo(
	({
		rawContext,
		remoteSubdomain,
		style,
		acceptTouch,
		emojiMap,
	}: ProfileDescProps) => {
		const { content } = useMfm({
			content: rawContext,
			remoteSubdomain,
			emojiMap: emojiMap || new Map(),
			deps: [rawContext],
			fontFamily: APP_FONTS.INTER_500_MEDIUM,
			acceptTouch,
			emphasis: 'high',
		});

		return <View style={style}>{content}</View>;
	},
);

export default ProfileDesc;
