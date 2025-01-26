import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import useAppNavigator from '../../../../states/useAppNavigator';
import { AppPostObject } from '../../../../types/app-post.types';
import { appDimensions } from '../../../../styles/dimensions';

const TIMELINE_PFP_SIZE = appDimensions.timelines.avatarIconSize;

/**
 * Renders the user (poster)'s avatar
 */
export function OriginalPostedPfpFragment({
	url,
	onClick,
}: {
	url: string;
	onClick: () => void;
}) {
	return (
		<TouchableOpacity
			onPress={onClick}
			style={{
				width: TIMELINE_PFP_SIZE,
				height: TIMELINE_PFP_SIZE,
				borderColor: 'rgba(200, 200, 200, 0.3)',
				borderWidth: 1,
				borderRadius: TIMELINE_PFP_SIZE / 2,
				marginTop: 2,
				flexShrink: 1,
			}}
		>
			{/* @ts-ignore */}
			<Image
				style={{
					flex: 1,
					backgroundColor: '#0553',
					padding: 2,
					borderRadius: TIMELINE_PFP_SIZE / 2,
					overflow: 'hidden',
				}}
				source={{ uri: url }}
			/>
		</TouchableOpacity>
	);
}

type OriginalPosterProps = {
	dto: AppPostObject;
	style?: StyleProp<ViewStyle>;
};

/**
 * This is the author indicator for
 * the bottom-most post item
 */
function PostCreatedByIconOnly({ dto, style }: OriginalPosterProps) {
	const { toProfile } = useAppNavigator();

	const STATUS_DTO = dto.meta.isBoost
		? dto.content.raw
			? dto
			: dto.boostedFrom
		: dto;

	function onPress() {
		toProfile(STATUS_DTO.postedBy.userId);
	}

	return (
		<View
			style={[
				{
					alignItems: 'center',
					flexDirection: 'row',
				},
				style,
			]}
		>
			<OriginalPostedPfpFragment
				url={STATUS_DTO.postedBy.avatarUrl}
				onClick={onPress}
			/>
		</View>
	);
}

export default PostCreatedByIconOnly;
