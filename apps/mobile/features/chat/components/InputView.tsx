import { TextInput, View, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

type Props = {
	ref: React.RefObject<TextInput>;
	// dynamic height based on text content
	height: number;
	setHeight: (height: number) => void;
	text: string;
	setText: (text: string) => void;
};

function InputView({ setHeight, text, setText, ref }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View style={{ flexGrow: 1 }}>
			<TextInput
				ref={ref}
				placeholder={t(`chatroom.sendInterfacePlaceholder`)}
				multiline={true}
				placeholderTextColor={theme.primaryText}
				onContentSizeChange={(e) => {
					// const _height = e.nativeEvent.contentSize.height;
					// setHeight(Math.min(MAX_HEIGHT, _height)); // Update height based on content
				}}
				onChangeText={setText}
				value={text}
				style={[
					styles.root,
					{
						backgroundColor: theme.primary,
						color: theme.primaryText,
					},
				]}
			/>
		</View>
	);
}

export default InputView;

const styles = StyleSheet.create({
	root: {
		textDecorationLine: 'none',
		flex: 1,
		borderRadius: 12,
		paddingVertical: 8,
		paddingLeft: 12,
		marginLeft: 6,
	},
});
