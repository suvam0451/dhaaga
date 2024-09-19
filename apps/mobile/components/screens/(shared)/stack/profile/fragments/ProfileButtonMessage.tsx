import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../../../lib/Icon';

type ProfilePeekMessageProps = {
	handle: string;
};

const ProfileButtonMessage = memo(({ handle }: ProfilePeekMessageProps) => {
	const { colorScheme } = useAppTheme();
	const { setType, PostComposerTextSeedRef, setVisible, updateRequestId } =
		useAppBottomSheet();

	function onPress() {
		PostComposerTextSeedRef.current = `${handle} `;
		setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		setVisible(true);
		updateRequestId();
	}

	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: colorScheme.palette.menubar, // 282828
				borderRadius: 8,
			}}
			onPress={onPress}
		>
			<AppIcon id={'message'} size={20} emphasis={'high'} />
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
