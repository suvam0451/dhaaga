import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppBottomSheet } from '../../../../../dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import { AppIcon } from '../../../../../lib/Icon';
import useGlobalState, {
	APP_BOTTOM_SHEET_ENUM,
} from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type ProfilePeekMessageProps = {
	handle: string;
};

const ProfileButtonMessage = memo(({ handle }: ProfilePeekMessageProps) => {
	const { theme, show, setType } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			show: o.bottomSheet.show,
			setType: o.bottomSheet.setType,
		})),
	);
	const { PostComposerTextSeedRef } = useAppBottomSheet();

	function onPress() {
		PostComposerTextSeedRef.current = `${handle} `;
		setType(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		show();
	}

	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: theme.palette.menubar, // 282828
				borderRadius: 8,
			}}
			onPress={onPress}
		>
			<AppIcon id={'message'} size={20} emphasis={'high'} />
		</TouchableOpacity>
	);
});

export default ProfileButtonMessage;
