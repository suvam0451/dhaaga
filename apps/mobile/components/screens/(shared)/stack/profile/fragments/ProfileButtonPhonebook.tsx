import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../../../states/_global';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../../utils/theming.util';

/**
 * Will bring up the
 * "Contact Book" feature
 * in the future.
 *
 * @deprecated
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
			<AppIcon
				id={'phonebook'}
				size={20}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A40}
			/>
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
