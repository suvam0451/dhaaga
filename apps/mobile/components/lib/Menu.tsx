import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type AppMenuOptionType = {
	Icon: any;
	label: string;
	desc?: string;
	onClick: () => void;
};

export class AppMenu {
	static Option({ Icon, label, desc, onClick }: AppMenuOptionType) {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		return (
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					paddingVertical: 8,
					paddingHorizontal: 8,
					alignItems: 'center',
					width: '100%',
					minHeight: 52,
				}}
				onPress={onClick}
			>
				{Icon}
				<View
					style={{
						marginLeft: 12,
						paddingRight: 4,
					}}
				>
					<Text
						style={{
							color: theme.textColor.high,
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							fontSize: 18,
						}}
					>
						{label}
					</Text>
					{desc && (
						<Text
							style={{
								color: theme.textColor.medium,
								flexWrap: 'wrap',
							}}
						>
							{desc}
						</Text>
					)}
				</View>
			</TouchableOpacity>
		);
	}
}
