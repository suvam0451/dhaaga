import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';

/**
 * Will bring up the
 * "Contact Book" feature
 * in the future.
 */
const ProfileButtonMessage = memo(() => {
	const { colorScheme } = useAppTheme();
	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: colorScheme.palette.menubar, // 242424
				borderRadius: 8,
			}}
		>
			<AppIcon id={'phonebook'} size={20} emphasis={'low'} />
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
