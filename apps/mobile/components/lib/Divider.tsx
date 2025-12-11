import { StyleProp, View, ViewStyle } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';

type AppDividerProps = {
	style?: StyleProp<ViewStyle>;
};

export class AppDivider {
	/**
	 * Divider. Works well on darkest backgrounds.
	 */
	static Soft({ style }: AppDividerProps) {
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

	static Hard({ style }: AppDividerProps) {
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
}
