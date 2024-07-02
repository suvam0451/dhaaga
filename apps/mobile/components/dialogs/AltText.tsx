import { RneuiDialogProps } from './_types';
import { Text, View } from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AppDialogContainer from '../containers/AppDialogContainer';

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
				<View>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: 'Inter-Bold',
							fontSize: 20,
						}}
					>
						Alt Text
					</Text>
				</View>

				<View style={{ padding: 8, marginRight: -8, marginTop: -12 }}>
					<MaterialCommunityIcons
						name="text-to-speech"
						size={28}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</View>

			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
				}}
			>
				{text}
			</Text>
		</AppDialogContainer>
	);
}

export default AltText;
