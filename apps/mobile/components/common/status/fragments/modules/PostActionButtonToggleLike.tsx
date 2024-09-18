import { memo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppTimelinePosts } from '../../../../../hooks/app/timelines/useAppTimelinePosts';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';

const ICON_SIZE = 24;
const ACTIVE_COLOR = '#deba7a'; // APP_THEME.LINK

type PostActionButtonToggleLikeProps = {
	id: string;
	flag: boolean;
	isFinal: boolean;
};

/**
 * Like toggle indicator button
 */
const PostActionButtonToggleLike = memo(
	({ id, flag }: PostActionButtonToggleLikeProps) => {
		const [IsLoading, setIsLoading] = useState(false);
		const { toggleLike } = useAppTimelinePosts();
		const { colorScheme } = useAppTheme();

		function onPress() {
			toggleLike(id, setIsLoading);
		}

		return (
			<TouchableOpacity
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 14,
					paddingTop: 8,
					paddingBottom: 8,
				}}
				onPress={onPress}
			>
				{IsLoading ? (
					<ActivityIndicator size={'small'} />
				) : (
					<AntDesign
						name={flag ? 'like1' : 'like2'}
						size={ICON_SIZE}
						color={flag ? ACTIVE_COLOR : colorScheme.textColor.medium}
					/>
				)}
			</TouchableOpacity>
		);
	},
);

export default PostActionButtonToggleLike;
