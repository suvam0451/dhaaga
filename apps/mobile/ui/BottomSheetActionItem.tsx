import { useAppTheme } from '#/states/global/hooks';
import { NativeTextMedium, NativeTextNormal } from '#/ui/NativeText';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { useState } from 'react';

type Props = {
	iconId: any;
	label: string;
	desc?: string;
	onPress: () => Promise<void>;
	active?: boolean;
	size?: number;
};

function BottomSheetActionItem({
	iconId,
	label,
	desc,
	onPress,
	active,
	size,
}: Props) {
	const [IsLoading, setIsLoading] = useState(false);

	function _onPress() {
		setIsLoading(true);
		onPress().finally(() => setIsLoading(false));
	}

	const { theme } = useAppTheme();
	return (
		<Pressable style={styles.root} onPress={_onPress}>
			<View style={styles.bottonArea}>
				{IsLoading ? (
					<ActivityIndicator color={theme.primary} />
				) : (
					<AppIcon
						id={iconId}
						color={active ? theme.primary : theme.secondary.a10}
					/>
				)}
			</View>
			<View style={styles.labelArea}>
				<NativeTextMedium
					style={{
						color: active ? theme.primary : theme.secondary.a10,
						fontSize: 18,
					}}
				>
					{label}
				</NativeTextMedium>
				{desc && (
					<NativeTextNormal
						style={{
							color: theme.secondary.a20,
							flexWrap: 'wrap',
						}}
					>
						{desc}
					</NativeTextNormal>
				)}
			</View>
		</Pressable>
	);
}

export default BottomSheetActionItem;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 8,
		alignItems: 'center',
		width: '100%',
		minHeight: 52,
	},
	bottonArea: {
		width: 24,
		height: 24,
	},
	labelArea: {
		marginLeft: 12,
		paddingRight: 4,
	},
});
