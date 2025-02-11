import { RneuiDialogProps } from './_types';
import { View } from 'react-native';
import AppDialogContainer from '../containers/AppDialogContainer';
import { AppText } from '../lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';

type Props = {
	text: string;
} & RneuiDialogProps;

function AltText({ IsVisible, setIsVisible, text }: Props) {
	return (
		<AppDialogContainer IsVisible={IsVisible} setIsVisible={setIsVisible}>
			<View
				style={{
					display: 'flex',
					width: '100%',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginBottom: 4,
				}}
			>
				<AppText.SemiBold
					style={{
						fontSize: 20,
					}}
				>
					Alt Text
				</AppText.SemiBold>
			</View>

			<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
				{text}
			</AppText.Normal>
		</AppDialogContainer>
	);
}

export default AltText;
