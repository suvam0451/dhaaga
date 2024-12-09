import { Fragment, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import ActivityPubService from '../../../../../services/activitypub.service';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';

const ActionButton = memo(
	({
		Icon,
		label,
		desc,
		onClick,
	}: {
		Icon: any;
		label: string;
		desc?: string;
		onClick: () => void;
	}) => {
		const { colorScheme } = useAppTheme();
		return (
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					paddingVertical: 8,
					paddingHorizontal: 8,
					alignItems: 'center',
					width: '100%',
				}}
				onPress={onClick}
			>
				{Icon}
				<View
					style={{
						marginLeft: 12,
						paddingRight: 4,
					}}
				>
					<Text
						style={{
							color: colorScheme.textColor.high,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 18,
						}}
					>
						{label}
					</Text>
					{desc && (
						<Text
							style={{
								color: colorScheme.textColor.medium,
								flexWrap: 'wrap',
							}}
						>
							{desc}
						</Text>
					)}
				</View>
			</TouchableOpacity>
		);
	},
);

const PostMoreActionsPostTarget = memo(
	({
		setEditMode,
	}: {
		setEditMode: React.Dispatch<React.SetStateAction<'root' | 'emoji'>>;
	}) => {
		const { colorScheme } = useAppTheme();
		const { client, domain } = useActivityPubRestClientContext();
		const { PostRef, timelineDataPostListReducer, setVisible } =
			useAppBottomSheet();

		const IS_BOOKMARKED = PostRef.current.interaction.bookmarked;
		const IS_LIKED = PostRef.current.interaction.liked;

		const IS_REACTED = !PostRef.current?.stats?.reactions?.every(
			(o) => o.me === false,
		);

		let ReactionCta = 'Add Reaction';
		if (IS_REACTED) {
			if (ActivityPubService.pleromaLike(domain)) {
				ReactionCta = 'Add More Reactions';
			} else {
				ReactionCta = 'Change Reaction';
			}
		}

		const IS_MASTODON = domain === KNOWN_SOFTWARE.MASTODON;

		function onClickAddReaction() {
			setEditMode('emoji');
		}

		function onClickToggleLike() {
			ActivityPubService.toggleLike(
				client,
				PostRef.current.id,
				PostRef.current.interaction.liked,
				domain as any,
			)
				.then((res) => {
					timelineDataPostListReducer.current({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_LIKE_STATUS,
						payload: {
							id: PostRef.current.id,
							delta: res,
						},
					});
				})
				.finally(() => {
					setVisible(false);
				});
		}

		function onClickToggleBookmark() {
			ActivityPubService.toggleBookmark(
				client,
				PostRef.current.id,
				PostRef.current.interaction.bookmarked,
			)
				.then((res) => {
					timelineDataPostListReducer.current({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS,
						payload: {
							id: PostRef.current.id,
							value: res,
						},
					});
				})
				.finally(() => {
					setVisible(false);
				});
		}

		const IS_MASTODON_LIKE = ActivityPubService.mastodonLike(domain);

		return (
			<Fragment>
				<ActionButton
					Icon={
						<Ionicons
							color={
								IS_BOOKMARKED
									? APP_THEME.INVALID_ITEM
									: APP_FONT.MONTSERRAT_HEADER
							}
							name={'bookmark'}
							size={24}
						/>
					}
					label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
					desc={'Save this post to view/read later.'}
					onClick={onClickToggleBookmark}
				/>
				{IS_MASTODON_LIKE && (
					<ActionButton
						Icon={
							<AntDesign
								name={IS_LIKED ? 'like1' : 'like2'}
								size={24}
								color={IS_LIKED ? APP_THEME.LINK : colorScheme.textColor.high}
							/>
						}
						label={IS_LIKED ? 'Remove Like' : 'Add Like'}
						desc={'Your likes can be seen by other users.'}
						onClick={onClickToggleLike}
					/>
				)}
				{!IS_MASTODON && (
					<ActionButton
						Icon={
							<MaterialIcons
								name="add-reaction"
								size={24}
								color={colorScheme.textColor.high}
							/>
						}
						label={ReactionCta}
						onClick={onClickAddReaction}
					/>
				)}
			</Fragment>
		);
	},
);

export default PostMoreActionsPostTarget;
