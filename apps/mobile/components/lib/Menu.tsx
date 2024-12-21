import { Pressable, Text, View } from 'react-native';
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
			<Pressable
				style={{
					flexDirection: 'row',
					padding: 8,
					alignItems: 'center',
					width: '100%',
					minHeight: 64,
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
							color: theme.secondary.a10,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							fontSize: 18,
							marginBottom: 2,
						}}
					>
						{label}
					</Text>
					{desc && (
						<Text
							style={{
								color: theme.secondary.a30,
								flexWrap: 'wrap',
							}}
						>
							{desc}
						</Text>
					)}
				</View>
			</Pressable>
		);
	}
}
