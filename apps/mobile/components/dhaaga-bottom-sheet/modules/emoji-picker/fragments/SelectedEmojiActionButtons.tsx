import { Fragment, memo, useState } from 'react';
import { APP_FONT } from '#/styles/AppTheme';
import { FontAwesome } from '@expo/vector-icons';
import {
	APP_BOTTOM_SHEET_ACTION_CATEGORY,
	AppButtonBottomSheetAction,
} from '../../../../lib/Buttons';
import { CustomEmojiObjectType } from '@dhaaga/bridge';

type SelectedEmojiActionButtonsProps = {
	selection: CustomEmojiObjectType | null;
	onSelect: (shortCode: string) => Promise<void>;
	onCancel: () => void;
};

const SelectedEmojiActionButtons = memo(
	({ selection, onSelect }: SelectedEmojiActionButtonsProps) => {
		const [Loading, setLoading] = useState(false);
		function onConfirmPick() {
			if (!selection) return;
			setLoading(true);
			onSelect(selection.shortCode)
				.then((res) => {
					console.log(res);
				})
				.finally(() => {
					setLoading(false);
				});
		}

		return (
			<Fragment>
				<AppButtonBottomSheetAction
					onPress={onConfirmPick}
					Icon={
						<FontAwesome
							name="send"
							size={20}
							style={{ marginLeft: 8 }}
							color={selection ? APP_FONT.MONTSERRAT_BODY : APP_FONT.DISABLED}
						/>
					}
					loading={Loading}
					type={APP_BOTTOM_SHEET_ACTION_CATEGORY.PROGRESS}
					disabled={!selection}
					label={'Pick'}
					style={{
						marginLeft: 6,
					}}
				/>
			</Fragment>
		);
	},
);

export default SelectedEmojiActionButtons;
