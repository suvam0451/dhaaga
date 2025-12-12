import { Dispatch, Fragment, SetStateAction } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import { DriverService, PostInspector } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { usePostEventBusActions } from '#/hooks/pubsub/usePostEventBusActions';
import { AppDividerSoft } from '#/ui/Divider';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';
import { HapticUtils } from '#/utils/haptics';

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
				<NativeTextMedium
					style={{
						color: active ? theme.primary : theme.secondary.a10,
						fontSize: 18,
					}}
				>
					{label}
				</NativeTextMedium>
				{desc && (
					<NativeTextNormal
						style={{
							color: theme.secondary.a20,
							flexWrap: 'wrap',
							fontFamily: APP_FONTS.ROBOTO_400,
						}}
					>
						{desc}
					</NativeTextNormal>
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
							color={IS_BOOKMARKED ? theme.primary : theme.secondary.a10}
							id={'bookmark'}
							size={24}
						/>
					}
					label={IS_BOOKMARKED ? 'Remove Bookmark' : 'Bookmark'}
					active={IS_BOOKMARKED}
					desc={'Save this post for later'}
					onClick={() => {
						toggleBookmark(HapticUtils.medium);
					}}
				/>
			)}
			{DriverService.canLike(driver) && (
				<ActionButton
					Icon={
						<AppIcon
							id={IS_LIKED ? 'heart' : 'heart-outline'}
							color={IS_LIKED ? theme.primary : theme.secondary.a10}
						/>
					}
					active={IS_LIKED}
					label={IS_LIKED ? 'Remove Like' : 'Add Like'}
					desc={'Your likes are visible to everyone'}
					onClick={() => {
						toggleLike(HapticUtils.medium);
					}}
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
			<AppDividerSoft
				style={{ backgroundColor: '#323232', marginVertical: 4 }}
			/>
			<ActionButton
				Icon={
					<AppIcon id={'share'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				active={IS_SHARED}
				label={'Copy or Share Link'}
				desc={'Opens the sharing sheet'}
				onClick={() => {}}
			/>

			<AppDividerSoft
				style={{ backgroundColor: '#323232', marginVertical: 4 }}
			/>
			<ActionButton
				Icon={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={'Open in Browser'}
				desc={'View in external browser'}
				onClick={() => {}}
			/>
		</Fragment>
	);
}

export default MorePostActionsPresenter;
