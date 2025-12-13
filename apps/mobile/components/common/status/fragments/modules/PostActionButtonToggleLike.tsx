import { useState } from 'react';
import { AppToggleIcon } from '../../../../lib/Icon';
import { withPostItemContext } from '../../../../containers/WithPostItemContext';
import { useAppPublishers, useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { Pressable } from 'react-native';

/**
 * Like toggle button
 */
function PostActionButtonToggleLike() {
	const { dto } = withPostItemContext();
	const { theme } = useAppTheme();
	const { postEventBus } = useAppPublishers();
	const [IsLoading, setIsLoading] = useState(false);

	function onPress() {
		postEventBus.toggleLike(dto.uuid, setIsLoading);
	}

	const FLAG = dto.interaction.liked;
	return (
		<Pressable onPress={onPress}>
			<AppToggleIcon
				flag={FLAG}
				activeIconId={'heart'}
				inactiveIconId={'heart-outline'}
				activeTint={theme.primary}
				inactiveTint={theme.secondary.a10}
				size={appDimensions.timelines.actionButtonSize}
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 16,
					paddingTop: 8,
					paddingBottom: 8,
				}}
			/>
		</Pressable>
	);
}

export default PostActionButtonToggleLike;
