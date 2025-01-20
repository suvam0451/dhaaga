import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
};

function QuickPost({ onPress, style }: Props) {
	const { theme } = useAppTheme();

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
				<Text
					style={{
						color: 'black',
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					Quick Post
				</Text>
			</Pressable>
		</View>
	);
}

export default QuickPost;
