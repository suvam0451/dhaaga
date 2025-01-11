import { View } from 'react-native';
import { Image } from 'expo-image';
import useMfm from '../../hooks/useMfm';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppPostObject } from '../../../types/app-post.types';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../lib/Text';

type Props = {
	dto: AppPostObject;
};
/**
 *
 * @constructor
 */
function ReplyOwner({ dto }: Props) {
	const { theme } = useAppTheme();
	const { content } = useMfm({
		content: dto.postedBy.displayName || 'N/A',
		emojiMap: dto.calculated.emojis as any,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	});

	const IS_VALID_DISPLAY_NAME = !!dto.postedBy.displayName;

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
			}}
		>
			<View
				style={{
					width: appDimensions.timelines.avatarIconSize,
					height: appDimensions.timelines.avatarIconSize,
					borderColor: 'gray',
					borderWidth: 1,
					borderRadius: appDimensions.timelines.avatarIconSize / 2,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					style={{
						flex: 1,
						width: '100%',
						opacity: 0.87,
						borderRadius: appDimensions.timelines.avatarIconSize / 2,
					}}
					source={{ uri: dto.postedBy.avatarUrl }}
				/>
			</View>
			<View style={{ marginLeft: 8 }}>
				{IS_VALID_DISPLAY_NAME ? (
					content
				) : (
					<AppText.SemiBold>{''}</AppText.SemiBold>
				)}
				<AppText.Medium
					style={{
						color: theme.secondary.a30,
						fontSize: 13,
					}}
				>
					{dto.postedBy.handle}
				</AppText.Medium>
			</View>
		</View>
	);
}

export default ReplyOwner;
