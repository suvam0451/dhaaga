import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONTS } from '#/styles/AppFonts';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

export function ReplyIndicator() {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				borderRadius: 8,
				borderBottomLeftRadius: 0,
				borderBottomRightRadius: 0,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: 6,
					paddingHorizontal: 12,
				}}
			>
				<Ionicons
					color={theme.complementaryA.a0}
					name={'arrow-redo-outline'}
					size={14}
				/>
				<Text
					style={{
						color: theme.textColor.medium,
						marginLeft: 4,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 13,
					}}
				>
					Replied to a thread
				</Text>
			</View>
		</View>
	);
}
