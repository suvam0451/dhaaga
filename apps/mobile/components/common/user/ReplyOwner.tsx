import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import useMfm from '../../hooks/useMfm';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppPostObject } from '../../../types/app-post.types';
import { appDimensions } from '../../../styles/dimensions';

type Props = {
	dto: AppPostObject;
};
/**
 *
 * @constructor
 */
function ReplyOwner({ dto }: Props) {
	const { content: UsernameWithEmojis } = useMfm({
		content: dto.postedBy.displayName,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis as any,
		deps: [dto.postedBy.displayName],
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	});

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				marginBottom: 8,
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
				{UsernameWithEmojis}
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						fontSize: 12,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					{dto.postedBy.handle}
				</Text>
			</View>
		</View>
	);
}

export default ReplyOwner;
