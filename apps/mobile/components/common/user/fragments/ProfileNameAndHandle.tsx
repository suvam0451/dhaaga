import { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import styles from '../utils/styles';
import useMfm from '../../../hooks/useMfm';
import { AppUserObject } from '../../../../types/app-user.types';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';

type ProfileNameAndHandleProps = {
	dto: AppUserObject;
	style: StyleProp<ViewStyle>;
};
/**
 * Renders the profile's display
 * name and handle
 */
const ProfileNameAndHandle = memo(
	({ style, dto }: ProfileNameAndHandleProps) => {
		const { content: ParsedDisplayName } = useMfm({
			content: dto?.displayName,
			remoteSubdomain: dto?.instance,
			emojiMap: dto?.calculated?.emojis,
			deps: [dto?.displayName],
			fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
			numberOfLines: 1,
			emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
		});

		return (
			<View style={style}>
				{ParsedDisplayName}
				<Text style={styles.secondaryText} numberOfLines={1}>
					{dto?.handle}
				</Text>
			</View>
		);
	},
);

export default ProfileNameAndHandle;
