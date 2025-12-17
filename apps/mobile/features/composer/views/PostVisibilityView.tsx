import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { NativeTextNormal } from '#/ui/NativeText';

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
				<NativeTextNormal
					style={[
						styles.choiceText,
						{
							color: theme.complementary,
						},
					]}
				>
					{label}
				</NativeTextNormal>
				<View style={{ marginLeft: 6, width: 24 }}>{Icon}</View>
			</View>
		</TouchableOpacity>
	);
}

export default PostVisibilityView;

const styles = StyleSheet.create({
	choiceText: {
		fontSize: 16,
	},
	choiceContainer: {
		padding: 6,
		paddingRight: 0,
		alignItems: 'center',
		flexDirection: 'row',
	},
});
