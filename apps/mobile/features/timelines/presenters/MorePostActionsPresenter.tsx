import { Dispatch, Fragment, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { AppText } from '#/components/lib/Text';
import { AppDivider } from '#/components/lib/Divider';
import { APP_FONTS } from '#/styles/AppFonts';
import { DriverService, PostInspector } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBusActions';

function ActionButton({
	Icon,
	label,
	desc,
	onClick,
	active,
}: {
	Icon: any;
	label: string;
	desc?: string;
	onClick: () => void;
	active?: boolean;
}) {
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
			<View>{Icon}</View>
			<View
				style={{
					marginLeft: 12,
					paddingRight: 4,
				}}
			>
				<AppText.Medium
					style={{
						color: active ? theme.primary.a0 : theme.secondary.a10,
						fontSize: 18,
					}}
				>
					{label}
				</AppText.Medium>
				{desc && (
					<AppText.Normal
						style={{
							color: theme.secondary.a20,
							flexWrap: 'wrap',
							fontFamily: APP_FONTS.ROBOTO_400,
						}}
					>
						{desc}
					</AppText.Normal>
				)}
			</View>
		</TouchableOpacity>
	);
}

function MorePostActionsPresenter({
	setEditMode,
	item,
}: {
	setEditMode: Dispatch<SetStateAction<'root' | 'emoji'>>;
	item: PostObjectType;
}) {
	const { driver } = useAppApiClient();
	const { theme } = useAppTheme();
	const _target = PostInspector.getContentTarget(item);
	const { show } = useAppBottomSheet();

	const IS_BOOKMARKED = _target?.interaction.bookmarked;
	const IS_LIKED = PostInspector.isLiked(_target);
	const IS_SHARED = PostInspector.isShared(_target);
	const IS_REACTED = _target?.stats?.reactions?.every((o) => o.me === false);

	let ReactionCta = 'Add Reaction';
	if (IS_REACTED) {
		if (DriverService.supportsPleromaApi(driver)) {
			ReactionCta = 'Add More Reactions';
		} else {
			ReactionCta = 'Change Reaction';
		}
	}

	const { toggleLike, toggleBookmark } = usePostEventBusActions(item.uuid);
	function onClickAddReaction() {
		setEditMode('emoji');
	}

	function onReply() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true, {
			$type: 'compose-reply',
			parentPostId: _target.uuid,
		});
	}

	return (
		<Fragment>
			{DriverService.canBookmark(driver) && (
				<ActionButton
					Icon={
						<AppIcon
							color={IS_BOOKMARKED ? theme.primary.a0 : theme.secondary.a10}
							id={'bookmark'}
							size={24}
						/>
					}
					label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
					active={IS_BOOKMARKED}
					desc={'Save this post for later'}
					onClick={toggleBookmark}
				/>
			)}
			{DriverService.canLike(driver) && (
				<ActionButton
					Icon={
						<AppIcon
							id={IS_LIKED ? 'heart' : 'heart-outline'}
							color={IS_LIKED ? theme.primary.a0 : theme.secondary.a10}
						/>
					}
					active={IS_LIKED}
					label={IS_LIKED ? 'Remove Like' : 'Add Like'}
					desc={'Your likes are public'}
					onClick={toggleLike}
				/>
			)}
			{DriverService.canReact(driver) && (
				<ActionButton
					Icon={
						<AppIcon id={'smiley'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					active={false}
					label={ReactionCta}
					onClick={onClickAddReaction}
				/>
			)}

			<ActionButton
				Icon={
					<AppIcon
						id={'chatbox-outline'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						size={24}
					/>
				}
				active={false}
				label={'Reply'}
				onClick={onReply}
			/>

			<ActionButton
				Icon={
					<AppIcon
						id={'sync-outline'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					/>
				}
				active={false}
				label={'Repost'}
				onClick={() => {}}
			/>
			<AppDivider.Hard
				style={{ backgroundColor: '#323232', marginVertical: 4 }}
			/>
			<ActionButton
				Icon={
					<AppIcon id={'share'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				active={IS_SHARED}
				label={IS_SHARED ? 'Remove Share' : 'Share'}
				onClick={() => {}}
			/>

			<AppDivider.Hard
				style={{ backgroundColor: '#323232', marginVertical: 4 }}
			/>
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
}

export default MorePostActionsPresenter;
