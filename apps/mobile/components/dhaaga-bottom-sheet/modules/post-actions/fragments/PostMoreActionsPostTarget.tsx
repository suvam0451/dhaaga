import { Fragment, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';

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
							color: APP_FONT.MONTSERRAT_HEADER,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,

							fontSize: 18,
						}}
					>
						{label}
					</Text>
					{desc && (
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
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
		const { PostRef } = useAppBottomSheet();
		const IS_BOOKMARKED = PostRef.current.interaction.bookmarked;

		function onClickAddReaction() {
			setEditMode('emoji');
		}

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
					desc={'Save the post to read later.'}
					onClick={() => {}}
				/>
				<ActionButton
					Icon={
						<AntDesign
							name="like2"
							size={24}
							color={APP_FONT.MONTSERRAT_HEADER}
						/>
					}
					label={'Add Like'}
					desc={'The user will be notified you liked their post.'}
					onClick={() => {}}
				/>
				<ActionButton
					Icon={
						<MaterialIcons
							name="add-reaction"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					}
					label={'Add Reaction'}
					onClick={onClickAddReaction}
				/>
			</Fragment>
		);
	},
);

export default PostMoreActionsPostTarget;
