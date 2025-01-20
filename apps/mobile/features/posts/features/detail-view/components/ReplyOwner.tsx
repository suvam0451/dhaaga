import { StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { AppPostObject } from '../../../../../types/app-post.types';
import { appDimensions } from '../../../../../styles/dimensions';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../../../components/lib/Text';
import { TextContentView } from '../../../../../components/common/status/TextContentView';

type Props = {
	dto: AppPostObject;
	style?: StyleProp<ViewStyle>;
};

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

/**
 *
 * @constructor
 */
function ReplyOwner({ dto, style }: Props) {
	const { theme } = useAppTheme();
	return (
		<View
			style={[
				{
					display: 'flex',
					flexDirection: 'row',
					marginBottom: MARGIN_BOTTOM,
				},
				style,
			]}
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
						borderRadius: appDimensions.timelines.avatarIconSize / 2,
					}}
					source={{ uri: dto.postedBy.avatarUrl }}
				/>
			</View>
			<View style={{ marginLeft: 8, flex: 1 }}>
				<TextContentView
					tree={dto.postedBy.parsedDisplayName}
					variant={'displayName'}
					mentions={[]}
					emojiMap={dto.calculated.emojis}
					oneLine
				/>
				<AppText.Normal
					style={{
						color: theme.secondary.a40,
						fontSize: 13,
					}}
				>
					{dto.postedBy.handle}
				</AppText.Normal>
			</View>
		</View>
	);
}

export default ReplyOwner;
