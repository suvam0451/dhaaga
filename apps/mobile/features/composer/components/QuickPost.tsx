import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
};

function QuickPost({ onPress, style }: Props) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View
			style={[
				{
					paddingHorizontal: 10,
					marginTop: 'auto',
				},
				style,
			]}
		>
			<Pressable
				style={{
					backgroundColor: theme.primary.a0,
					alignSelf: 'center',
					minWidth: 128,
					maxWidth: 244,
					padding: 8,
					borderRadius: 8,
				}}
				onPress={onPress}
			>
				<AppText.SemiBold
					style={{
						color: 'black',
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					{t(`quickPost.name`)}
				</AppText.SemiBold>
			</Pressable>
		</View>
	);
}

export default QuickPost;
