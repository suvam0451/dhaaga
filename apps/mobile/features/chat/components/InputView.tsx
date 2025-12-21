import { TextInput, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

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
					// const _height = e.nativeEvent.contentSize.height;
					// setHeight(Math.min(MAX_HEIGHT, _height)); // Update height based on content
				}}
				onChangeText={setText}
				value={text}
				style={{
					textDecorationLine: 'none',
					flex: 1,
					borderRadius: 12,
					backgroundColor: '#242424',
					paddingVertical: 8,
					paddingLeft: 12,
					marginLeft: 6,
					color: theme.secondary.a20,
				}}
			/>
		</View>
	);
}

export default InputView;
