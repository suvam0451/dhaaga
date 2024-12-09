import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import MediaItem from '../../media/MediaItem';
import PostStats from '../PostStats';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';
import { ActivityPubStatusAppDtoType } from '../../../../services/approto/app-status-dto.service';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import { APP_FONTS } from '../../../../styles/AppFonts';
import StatusVisibility from './StatusVisibility';
import StatusCreatedAt from './StatusCreatedAt';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

type Props = {
	dto: ActivityPubStatusAppDtoType;
	hasParent?: boolean;
};

const StatusHierarchyParent = memo(({ dto }: Props) => {
	const { colorScheme } = useAppTheme();
	const { toPost } = useAppNavigator();
	const { content } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis,
		deps: [dto],
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: 'high',
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
		emphasis: 'high',
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
								color: colorScheme.textColor.medium,
								fontSize: 13,
							}}
						>
							{dto.postedBy.handle}
						</Text>
					)}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
							justifyContent: 'flex-end',
						}}
					>
						<StatusVisibility visibility={dto.visibility} />
						<Text
							style={{
								color: colorScheme.textColor.low,
								marginLeft: 2,
								marginRight: 2,
							}}
						>
							•
						</Text>
						<View style={{ flexDirection: 'row' }}>
							<StatusCreatedAt
								from={new Date(dto.createdAt)}
								textStyle={{
									color: colorScheme.textColor.low,
									fontSize: 12,
									fontFamily: APP_FONTS.INTER_700_BOLD,
								}}
							/>
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
				<PostStats dto={dto} />
			</View>
			<View
				style={{
					position: 'absolute',
					height: '100%',
					left: 22,
					overflow: 'hidden',
				}}
			>
				<View
					style={{
						flex: 1,
						marginTop: 54,
						width: 1.5,
						backgroundColor: colorScheme.textColor.low,
					}}
				/>
			</View>
		</View>
	);
});

export default StatusHierarchyParent;
