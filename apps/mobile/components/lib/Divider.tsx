import { StyleProp, View, ViewStyle } from 'react-native';

type AppDividerProps = {
	style?: StyleProp<ViewStyle>;
};

export class AppDivider {
	static Soft({ style }: AppDividerProps) {
		return (
			<View
				style={[
					{
						backgroundColor: '#1e1e1e',
						height: 1,
					},
					style,
				]}
			/>
		);
	}

	static Hard({ style }: AppDividerProps) {
		return (
			<View
				style={[
					{
						backgroundColor: '#444',
						height: 1,
					},
					style,
				]}
			/>
		);
	}
}
