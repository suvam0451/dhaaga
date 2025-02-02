import {
	StyleProp,
	TouchableOpacity,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

type Props = {
	style?: StyleProp<ViewStyle>;
	isChecked: boolean;
	onPress: () => void;
};

const UNCHECKED_BG_COLOR = '#282828';

function AppSettingBooleanToggle({ isChecked, onPress, style }: Props) {
	const { theme } = useAppTheme();

	return (
		<TouchableOpacity style={[styles.root, style]} onPress={onPress}>
			<View
				style={[
					styles.iconContainerBase,
					{
						borderBottomEndRadius: 0,
						borderTopRightRadius: 0,
						backgroundColor: isChecked
							? UNCHECKED_BG_COLOR
							: theme.secondary.a50,
					},
				]}
			>
				<Entypo
					name="cross"
					size={24}
					color={isChecked ? theme.secondary.a50 : theme.secondary.a30}
				/>
			</View>
			<View
				style={[
					styles.iconContainerBase,
					{
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						backgroundColor: isChecked
							? theme.primary.a0
							: theme.background.a30,
					},
				]}
			>
				<Feather
					name="check"
					size={24}
					color={isChecked ? 'black' : theme.secondary.a40}
				/>
			</View>
		</TouchableOpacity>
	);
}

export default AppSettingBooleanToggle;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		borderRadius: 8,
		marginLeft: 8,
	},
	iconContainerBase: {
		borderRadius: 6,
		padding: 6,
		paddingVertical: 4,
	},
});
