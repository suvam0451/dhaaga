import { Fragment, memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { FontAwesome } from '@expo/vector-icons';
import { InstanceApi_CustomEmojiDTO } from '@dhaaga/shared-abstraction-activitypub';

type SelectedEmojiActionButtonsProps = {
	selection: InstanceApi_CustomEmojiDTO | null;
	onSelect: (shortCode: string) => void;
	onCancel: () => void;
};

const SelectedEmojiActionButtons = memo(
	({ selection, onSelect, onCancel }: SelectedEmojiActionButtonsProps) => {
		function onConfirmPick() {
			if (!selection) return;
			onSelect(selection.shortCode);
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
					onPress={onCancel}
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
