import { useState } from 'react';
import { usePostActionsInterface } from '../../../../../hooks/app/usePostActionsInterface';
import { AppToggleIcon } from '../../../../lib/Icon';
import { useAppStatusItem } from '../../../../../hooks/ap-proto/useAppStatusItem';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../../styles/dimensions';

/**
 * Like toggle button
 */
function PostActionButtonToggleLike() {
	const { dto } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { toggleLike } = usePostActionsInterface();
	const [IsLoading, setIsLoading] = useState(false);

	function onPress() {
		toggleLike(dto.id, setIsLoading);
	}

	const FLAG = dto.interaction.liked;
	return (
		<AppToggleIcon
			flag={FLAG}
			activeIconId={'heart'}
			inactiveIconId={'heart-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a10}
			size={appDimensions.timelines.actionButtonSize}
			onPress={onPress}
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginRight: 16,
				paddingTop: 8,
				paddingBottom: 8,
			}}
		/>
	);
}

export default PostActionButtonToggleLike;
