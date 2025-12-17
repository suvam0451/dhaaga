import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '#/states/global/hooks';
import { NativeTextBold } from '#/ui/NativeText';

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
					marginBottom: 4,
				}}
			>
				<Ionicons
					color={theme.secondary.a20}
					name={'arrow-redo-outline'}
					size={14}
				/>
				<NativeTextBold
					style={{
						marginLeft: 4,
						fontSize: 13,
						color: theme.secondary.a20,
					}}
				>
					Replied to a thread
				</NativeTextBold>
			</View>
		</View>
	);
}
