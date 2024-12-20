import { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import styles from '../utils/styles';
import useMfm from '../../../hooks/useMfm';
import { AppUserDto } from '../../../../types/app-user.types';

type ProfileNameAndHandleProps = {
	dto: AppUserDto;
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
			fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
			numberOfLines: 1,
			emphasis: 'high',
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
