import { useAppTheme } from '#/states/global/hooks';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
	style?: StyleProp<ViewStyle>;
};

export function AppDividerSoft({ style }: Props) {
	const { theme } = useAppTheme();
	return (
		<View
			style={[
				{
					backgroundColor: theme.background.a50,
					height: 1,
				},
				style,
			]}
		/>
	);
}

export function AppDividerHard({ style }: Props) {
	const { theme } = useAppTheme();
	return (
		<View
			style={[
				{
					backgroundColor: theme.secondary.a50,
					height: 1,
				},
				style,
			]}
		/>
	);
}
