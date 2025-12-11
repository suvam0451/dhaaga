import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppTheme } from '#/states/global/hooks';
import { AppText } from '#/components/lib/Text';

type Props = {
	label: string;
	onPress: () => void;
	Icon: any;
};

function PostVisibilityView({ label, Icon, onPress }: Props) {
	const { theme } = useAppTheme();

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={[styles.choiceContainer]}>
				<AppText.Normal
					style={[
						styles.choiceText,
						{
							color: theme.complementary.a0,
						},
					]}
				>
					{label}
				</AppText.Normal>
				<View style={{ marginLeft: 6, width: 24 }}>{Icon}</View>
			</View>
		</TouchableOpacity>
	);
}

export default PostVisibilityView;

const styles = StyleSheet.create({
	choiceText: {
		fontFamily: APP_FONTS.ROBOTO_500,
		fontSize: 16,
	},
	choiceContainer: {
		padding: 6,
		paddingRight: 0,
		alignItems: 'center',
		flexDirection: 'row',
	},
});
