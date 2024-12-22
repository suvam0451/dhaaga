import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import useMfm from '../../../hooks/useMfm';
import MediaItem from '../../media/MediaItem';
import PostStats from '../PostStats';
import useAppNavigator from '../../../../states/useAppNavigator';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import StatusQuoted from './StatusQuoted';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';
import { DatetimeUtil } from '../../../../utils/datetime.utils';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { AppPostObject } from '../../../../types/app-post.types';

type Props = {
	dto: AppPostObject;
	hasParent?: boolean;
};

const StatusHierarchyParent = memo(({ dto }: Props) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	const { toPost } = useAppNavigator();
	const { content } = useMfm({
		content: dto.content.raw,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis,
		deps: [dto.content.raw],
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	const { content: UsernameWithEmojis } = useMfm({
		content: dto.postedBy.displayName,
		remoteSubdomain: dto.postedBy.instance,
		emojiMap: dto.calculated.emojis,
		deps: [dto.postedBy.displayName],
		expectedHeight: 20,
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
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
			<View
				style={{
					marginLeft: 8,
					position: 'relative',
					flex: 1,
					marginBottom: 16,
				}}
			>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						alignItems: 'center',
						marginBottom: 6,
					}}
				>
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
					<Text
						style={{
							color: theme.secondary.a50,
							fontSize: 12,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
						}}
					>
						{' • '}
						{DatetimeUtil.timeAgo(dto.createdAt)}
					</Text>
				</View>

				<MediaItem
					attachments={dto.content.media}
					calculatedHeight={dto.calculated.mediaContainerHeight}
				/>
				<Pressable
					onPress={() => {
						toPost(dto.id);
					}}
				>
					{content}
				</Pressable>

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
					left: 16,
					// overflow: 'hidden',
				}}
			>
				<View
					style={{
						flex: 1,
						marginTop: 48,
						marginBottom: 8,
						width: 1.5,
						backgroundColor: '#323232',
					}}
				/>
			</View>
		</View>
	);
});

export default StatusHierarchyParent;
