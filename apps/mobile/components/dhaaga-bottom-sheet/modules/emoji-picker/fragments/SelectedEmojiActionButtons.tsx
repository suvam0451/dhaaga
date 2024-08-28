import { Fragment, memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { useComposerContext } from '../../post-composer/api/useComposerContext';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';
import TextEditorService from '../../../../../services/text-editor.service';

type SelectedEmojiActionButtonsProps = {
	selection: InstanceApi_CustomEmojiDTO | null;
};

const SelectedEmojiActionButtons = memo(
	({ selection }: SelectedEmojiActionButtonsProps) => {
		const { setEditMode, setRawText } = useComposerContext();

		function onPressBack() {
			setEditMode('txt');
		}

		function onConfirmPick() {
			if (!selection) return;
			setRawText((o) =>
				TextEditorService.addReactionText(o, selection.shortCode),
			);
			setEditMode('txt');
		}

		return (
			<Fragment>
				<TouchableOpacity
					style={{
						backgroundColor: APP_THEME.INVALID_ITEM_BODY,
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 12,
						borderRadius: 8,
						paddingVertical: 6,
					}}
					onPress={onPressBack}
				>
					<AntDesign name="back" size={20} color={APP_FONT.MONTSERRAT_BODY} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						backgroundColor: APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 12,
						borderRadius: 8,
						paddingVertical: 6,
						marginLeft: 6,
					}}
					onPress={onConfirmPick}
				>
					<Text
						style={{
							color: selection ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						}}
					>
						Pick
					</Text>
					<FontAwesome
						name="send"
						size={20}
						style={{ marginLeft: 8 }}
						color={selection ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED}
					/>
				</TouchableOpacity>
			</Fragment>
		);
	},
);

export default SelectedEmojiActionButtons;
