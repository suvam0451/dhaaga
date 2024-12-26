import { memo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppTimelinePosts } from '../../../../../hooks/app/timelines/useAppTimelinePosts';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import Ionicons from '@expo/vector-icons/Ionicons';

const ICON_SIZE = 28;
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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		function onPress() {
			toggleLike(id, setIsLoading);
		}

		return (
			<TouchableOpacity
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginRight: 16,
					paddingTop: 8,
					paddingBottom: 8,
				}}
				onPress={onPress}
			>
				{IsLoading ? (
					<ActivityIndicator size={'small'} />
				) : (
					<Ionicons
						name={flag ? 'heart' : 'heart-outline'}
						size={ICON_SIZE}
						color={flag ? ACTIVE_COLOR : theme.secondary.a10}
					/>
				)}
			</TouchableOpacity>
		);
	},
);

export default PostActionButtonToggleLike;
