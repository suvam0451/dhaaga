import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';

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
	({ rawContext, style, acceptTouch, emojiMap }: ProfileDescProps) => {
		const { content } = useMfm({
			content: rawContext,
			emojiMap: emojiMap || new Map(),
			fontFamily: APP_FONTS.INTER_500_MEDIUM,
			acceptTouch,
			emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
		});

		return <View style={style}>{content}</View>;
	},
);

export default ProfileDesc;
