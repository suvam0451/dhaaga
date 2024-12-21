import { StyleProp, View, ViewStyle } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../states/_global';

type AppDividerProps = {
	style?: StyleProp<ViewStyle>;
};

export class AppDivider {
	static Soft({ style }: AppDividerProps) {
		return (
			<View
				style={[
					{
						backgroundColor: '#3d3d3d',
						height: 1,
					},
					style,
				]}
			/>
		);
	}

	static Hard({ style }: AppDividerProps) {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		return (
			<View
				style={[
					{
						backgroundColor: theme.secondary.a30,
						height: 1,
					},
					style,
				]}
			/>
		);
	}
}
