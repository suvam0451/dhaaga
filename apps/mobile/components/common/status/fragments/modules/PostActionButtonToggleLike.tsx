import { useState } from 'react';
import { AppToggleIcon } from '../../../../lib/Icon';
import { withPostItemContext } from '../../../../containers/contexts/WithPostItemContext';
import {
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../../styles/dimensions';
import { Pressable } from 'react-native';

/**
 * Like toggle button
 */
function PostActionButtonToggleLike() {
	const { dto } = withPostItemContext();
	const { theme } = useAppTheme();
	const { postPub } = useAppPublishers();
	const [IsLoading, setIsLoading] = useState(false);

	function onPress() {
		postPub.toggleLike(dto.uuid, setIsLoading);
	}

	const FLAG = dto.interaction.liked;
	return (
		<Pressable onPress={onPress}>
			<AppToggleIcon
				flag={FLAG}
				activeIconId={'heart'}
				inactiveIconId={'heart-outline'}
				activeTint={theme.primary.a0}
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
