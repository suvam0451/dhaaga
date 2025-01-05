import { Dispatch, Fragment, memo, SetStateAction } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import ActivityPubService from '../../../../../services/activitypub.service';
import { AppIcon } from '../../../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';
import {
	useAppApiClient,
	useAppBottomSheet_Improved,
	useAppPublishers,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { AppPostObject } from '../../../../../types/app-post.types';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';
import { APP_BOTTOM_SHEET_ENUM } from '../../../Core';

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
		const { theme } = useAppTheme();
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
							color: theme.secondary.a10,
							fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
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
								fontFamily: APP_FONTS.INTER_400_REGULAR,
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
		item,
	}: {
		setEditMode: Dispatch<SetStateAction<'root' | 'emoji'>>;
		item: AppPostObject;
	}) => {
		const { postPub } = useAppPublishers();
		const { driver } = useAppApiClient();
		const { theme } = useAppTheme();
		const _target = PostMiddleware.getContentTarget(item);
		const { show, setCtx } = useAppBottomSheet_Improved();

		const IS_BOOKMARKED = _target?.interaction.bookmarked;
		const IS_LIKED = _target?.interaction.liked;
		const IS_REACTED = _target?.stats?.reactions?.every((o) => o.me === false);

		let ReactionCta = 'Add Reaction';
		if (IS_REACTED) {
			if (ActivityPubService.pleromaLike(driver)) {
				ReactionCta = 'Add More Reactions';
			} else {
				ReactionCta = 'Change Reaction';
			}
		}

		function onClickAddReaction() {
			setEditMode('emoji');
		}

		async function onClickToggleLike() {
			postPub.toggleLike(item.uuid);
		}

		async function onClickToggleBookmark() {
			postPub.toggleBookmark(item.uuid);
		}

		function onReply() {
			setCtx({ uuid: _target.uuid });
			show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
		}

		return (
			<Fragment>
				{ActivityPubService.canBookmark(driver) && (
					<ActionButton
						Icon={
							<Ionicons
								color={IS_BOOKMARKED ? theme.primary.a0 : theme.secondary.a10}
								name={'bookmark'}
								size={24}
							/>
						}
						label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
						desc={'Save this post to view later.'}
						onClick={onClickToggleBookmark}
					/>
				)}
				{ActivityPubService.canLike(driver) && (
					<ActionButton
						Icon={
							<AntDesign
								name={IS_LIKED ? 'like1' : 'like2'}
								size={24}
								color={IS_LIKED ? theme.primary.a0 : theme.secondary.a10}
							/>
						}
						label={IS_LIKED ? 'Remove Like' : 'Add Like'}
						desc={'Your likes are visible publicly.'}
						onClick={onClickToggleLike}
					/>
				)}
				{ActivityPubService.canAddReactions(driver) && (
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
						<AppIcon
							id={'chatbox-outline'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Reply'}
					onClick={onReply}
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
