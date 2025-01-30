import { TextInput, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

const MAX_HEIGHT = 160;

type Props = {
	// dynamic height based on text content
	height: number;
	setHeight: (height: number) => void;
	text: string;
	setText: (text: string) => void;
};

function InputView({ setHeight, text, setText }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View style={{ flexGrow: 1 }}>
			<TextInput
				placeholder={t(`chatroom.sendInterfacePlaceholder`)}
				multiline={true}
				placeholderTextColor={theme.secondary.a30}
				onContentSizeChange={(e) => {
					const _height = e.nativeEvent.contentSize.height;
					setHeight(Math.min(MAX_HEIGHT, _height)); // Update height based on content
				}}
				onChangeText={setText}
				value={text}
				style={{
					textDecorationLine: 'none',
					flex: 1,
					// flexGrow: 1,
					borderRadius: 12,
					backgroundColor: '#242424',
					paddingVertical: 8,
					paddingLeft: 12,
					marginLeft: 6,
					color: theme.secondary.a20,
					fontFamily: APP_FONTS.ROBOTO_400,
					height: 'auto',
					maxHeight: 192,
				}}
			/>
		</View>
	);
}

export default InputView;
