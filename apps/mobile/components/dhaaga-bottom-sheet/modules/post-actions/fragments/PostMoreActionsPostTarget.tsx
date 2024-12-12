import { Dispatch, Fragment, memo, SetStateAction } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import ActivityPubService from '../../../../../services/activitypub.service';
import { TIMELINE_POST_LIST_DATA_REDUCER_TYPE } from '../../../../common/timeline/api/postArrayReducer';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import useGlobalState from '../../../../../states/_global';
import { AppIcon } from '../../../../lib/Icon';
import { useShallow } from 'zustand/react/shallow';

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
		setEditMode: Dispatch<SetStateAction<'root' | 'emoji'>>;
	}) => {
		const { colorScheme } = useAppTheme();
		const { PostRef, reducer, hide, router, driver } = useGlobalState(
			useShallow((o) => ({
				PostRef: o.bottomSheet.PostRef,
				reducer: o.bottomSheet.timelineDataPostListReducer,
				router: o.router,
				driver: o.driver,
				hide: o.bottomSheet.hide,
			})),
		);

		const IS_BOOKMARKED = PostRef.interaction.bookmarked;
		const IS_LIKED = PostRef.interaction.liked;

		const IS_REACTED = !PostRef?.stats?.reactions?.every((o) => o.me === false);

		let ReactionCta = 'Add Reaction';
		if (IS_REACTED) {
			if (ActivityPubService.pleromaLike(driver)) {
				ReactionCta = 'Add More Reactions';
			} else {
				ReactionCta = 'Change Reaction';
			}
		}

		const IS_MASTODON = driver === KNOWN_SOFTWARE.MASTODON;

		function onClickAddReaction() {
			setEditMode('emoji');
		}

		function onClickToggleLike() {
			ActivityPubService.toggleLike(
				router,
				PostRef.id,
				PostRef.interaction.liked,
				driver as any,
			)
				.then((res) => {
					reducer({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_LIKE_STATUS,
						payload: {
							id: PostRef.id,
							delta: res,
						},
					});
				})
				.finally(() => {
					hide();
				});
		}

		function onClickToggleBookmark() {
			ActivityPubService.toggleBookmark(
				router,
				PostRef.id,
				PostRef.interaction.bookmarked,
			)
				.then((res) => {
					reducer({
						type: TIMELINE_POST_LIST_DATA_REDUCER_TYPE.UPDATE_BOOKMARK_STATUS,
						payload: {
							id: PostRef.id,
							value: res,
						},
					});
				})
				.finally(() => {
					hide();
				});
		}

		const IS_MASTODON_LIKE = ActivityPubService.mastodonLike(driver);

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
						Icon={<AppIcon id={'smiley'} emphasis={'high'} />}
						label={ReactionCta}
						onClick={onClickAddReaction}
					/>
				)}
			</Fragment>
		);
	},
);

export default PostMoreActionsPostTarget;
