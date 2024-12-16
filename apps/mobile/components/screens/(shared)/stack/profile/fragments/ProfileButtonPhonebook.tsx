import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../../states/_global';

/**
 * Will bring up the
 * "Contact Book" feature
 * in the future.
 */
const ProfileButtonMessage = memo(() => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: theme.palette.menubar, // 242424
				borderRadius: 8,
			}}
		>
			<AppIcon id={'phonebook'} size={20} emphasis={'low'} />
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
