import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { APP_FONT } from '../../../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

/**
 * Will bring up the
 * "Contact Book" feature
 * in the future.
 */
const ProfileButtonMessage = memo(() => {
	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: '#242424',
				borderRadius: 8,
			}}
		>
			<FontAwesome6 name="contact-book" size={20} color={APP_FONT.DISABLED} />
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
