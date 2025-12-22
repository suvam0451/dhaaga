import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '#/states/global/hooks';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { NativeTextBold } from '#/ui/NativeText';
import useComposerCreateAction from '#/features/composer/hooks/useComposerCreateAction';

/**
 * Click to Post!
 */
function PostButton() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { create, isLoading } = useComposerCreateAction();

	return (
		<TouchableOpacity
			style={[
				styles.root,
				{
					backgroundColor: theme.primary,
				},
			]}
			onPress={create}
		>
			<NativeTextBold
				style={{
					color: theme.primaryText,
				}}
			>
				{t(`composer.quickPostSubmit`)}
			</NativeTextBold>
			{isLoading ? (
				<ActivityIndicator
					size={20}
					style={{ marginLeft: 8 }}
					color={theme.primaryText}
				/>
			) : (
				<FontAwesome
					name="send"
					size={20}
					style={{ marginLeft: 8 }}
					color={theme.primaryText}
				/>
			)}
		</TouchableOpacity>
	);
}

export default PostButton;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		borderRadius: 8,
		paddingVertical: 8,
	},
});
