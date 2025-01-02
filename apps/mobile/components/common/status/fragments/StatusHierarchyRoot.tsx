import { memo } from 'react';
import useAppNavigator from '../../../../states/useAppNavigator';
import useMfm from '../../../hooks/useMfm';
import { Text, TouchableOpacity, View } from 'react-native';
import MediaItem from '../../media/MediaItem';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';
import PostStats from '../PostStats';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import StatusVisibility from './StatusVisibility';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { AppPostObject } from '../../../../types/app-post.types';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

type Props = {
	dto: AppPostObject;
};

const StatusHierarchyRoot = memo(({ dto }: Props) => {
	const { theme } = useAppTheme();
	const { toPost } = useAppNavigator();
	const { content } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis,
		deps: [dto],
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
	});

	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	const { content: UsernameWithEmojis } = useMfm({
		content: dto.postedBy.displayName,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis,
		deps: [dto.postedBy.displayName],
		expectedHeight: 20,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		numberOfLines: 1,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A0,
	});

	const VALID_DISPLAY_NAME =
		dto.postedBy.displayName !== null && dto.postedBy.displayName !== '';

	return (
		<View
			style={{
				marginTop: 4,
				position: 'relative',
				flexDirection: 'row',
				alignItems: 'flex-start',
			}}
		>
			<PostCreatedByIconOnly dto={dto} />
			<View style={{ marginLeft: 8, position: 'relative', flex: 1 }}>
				<View style={{ flexDirection: 'row', flex: 1 }}>
					{VALID_DISPLAY_NAME && UsernameWithEmojis ? (
						UsernameWithEmojis
					) : (
						<Text
							style={{
								flex: 1,
								color: theme.textColor.medium,
								fontSize: 13,
							}}
						>
							{dto.postedBy.handle}
						</Text>
					)}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end', // flex: 1,
							justifyContent: 'flex-end',
						}}
					>
						<StatusVisibility visibility={dto.visibility} />
						<Text
							style={{
								color: 'gray',
								marginLeft: 2,
								marginRight: 2,
								opacity: 0.6,
							}}
						>
							•
						</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text
								style={{
									color: theme.textColor.low,
									fontSize: 12,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
							>
								{DatetimeUtil.timeAgo(dto.createdAt)}
							</Text>
						</View>
					</View>
				</View>

				<TouchableOpacity
					delayPressIn={100}
					onPress={() => {
						toPost(dto.id);
					}}
				>
					{content}
				</TouchableOpacity>
				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
				{IS_QUOTE_BOOST && (
					<WithAppStatusItemContext dto={dto.boostedFrom}>
						<StatusQuoted />
					</WithAppStatusItemContext>
				)}
				<PostStats style={{ paddingBottom: 8 }} />
			</View>

			<View
				style={{
					position: 'absolute',
					height: '100%',
					left: 16,
					overflow: 'hidden',
				}}
			>
				<View
					style={{
						flex: 1,
						marginTop: 48,
						width: 1.5,
						backgroundColor: '#323232',
						borderRadius: 8,
					}}
				/>
			</View>
		</View>
	);
});

export default StatusHierarchyRoot;
