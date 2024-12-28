import {
	Dispatch,
	Fragment,
	memo,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import ActivityPubService from '../../../../../services/activitypub.service';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import useGlobalState from '../../../../../states/_global';
import { AppIcon } from '../../../../lib/Icon';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';
import {
	useAppBottomSheet_Improved,
	useAppBottomSheet_TimelineReference,
	useAppManager,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { AppPostObject } from '../../../../../types/app-post.types';
import { AppTimelineReducerActionType } from '../../../../../states/reducers/timeline.reducer';

function SectionDivider() {
	return (
		<View
			style={{
				paddingHorizontal: 4,
				paddingVertical: 4,
			}}
		>
			<View
				style={{
					height: 1,
					backgroundColor: '#484848',
					width: '100%',
				}}
			/>
		</View>
	);
}

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
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		return (
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					paddingVertical: 8,
					paddingHorizontal: 8,
					alignItems: 'center',
					width: '100%',
					minHeight: 52,
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
							color: theme.textColor.high,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 18,
						}}
					>
						{label}
					</Text>
					{desc && (
						<Text
							style={{
								color: theme.textColor.medium,
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
		const [PostTarget, setPostTarget] = useState<AppPostObject>(null);
		const { stateId } = useAppBottomSheet_Improved();
		const { appManager } = useAppManager();
		const { hide, router, driver } = useGlobalState(
			useShallow((o) => ({
				router: o.router,
				driver: o.driver,
				hide: o.bottomSheet.hide,
			})),
		);
		const { dispatch } = useAppBottomSheet_TimelineReference();

		useEffect(() => {
			setPostTarget(appManager.storage.getBottomSheetPostActionsTarget());
		}, [stateId]);

		const { theme } = useAppTheme();

		const IS_BOOKMARKED = PostTarget?.interaction.bookmarked;
		const IS_LIKED = PostTarget?.interaction.liked;

		const IS_REACTED = PostTarget?.stats?.reactions?.every(
			(o) => o.me === false,
		);

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
				PostTarget.id,
				PostTarget.interaction.liked,
				driver as any,
			)
				.then((res) => {
					dispatch({
						type: AppTimelineReducerActionType.UPDATE_LIKE_STATUS,
						payload: {
							id: PostTarget.id,
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
				PostTarget.id,
				PostTarget.interaction.bookmarked,
			)
				.then((res) => {
					console.log('bookmark success', res);
					if (!dispatch) {
						console.log('[WARN]: dispatcher not linked');
					}
					dispatch({
						type: AppTimelineReducerActionType.UPDATE_BOOKMARK_STATUS,
						payload: {
							id: PostTarget.id,
							value: res,
						},
					});
				})
				.finally(() => {
					console.log('bookmark success fail');
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
								IS_BOOKMARKED ? theme.complementary.a0 : theme.secondary.a10
							}
							name={'bookmark'}
							size={24}
						/>
					}
					label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
					desc={'Save this post to view later.'}
					onClick={onClickToggleBookmark}
				/>
				{IS_MASTODON_LIKE && (
					<ActionButton
						Icon={
							<AntDesign
								name={IS_LIKED ? 'like1' : 'like2'}
								size={24}
								color={IS_LIKED ? APP_THEME.LINK : theme.textColor.high}
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
							<AppIcon
								id={'smiley'}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
							/>
						}
						label={ReactionCta}
						onClick={onClickAddReaction}
					/>
				)}

				<ActionButton
					Icon={
						<AppIcon id={'smiley'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Reply'}
					onClick={() => {}}
				/>

				<SectionDivider />
				<ActionButton
					Icon={
						<AppIcon id={'share'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Share'}
					onClick={() => {}}
				/>

				<SectionDivider />
				<ActionButton
					Icon={
						<AppIcon
							id={'external-link'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Open in Browser'}
					onClick={() => {}}
				/>
				<ActionButton
					Icon={
						<AppIcon
							id={'external-link'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Open Original in Browser'}
					onClick={() => {}}
				/>
			</Fragment>
		);
	},
);

export default PostMoreActionsPostTarget;
