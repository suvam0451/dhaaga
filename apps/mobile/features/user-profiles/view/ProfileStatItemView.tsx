import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { NativeTextH6 } from '#/ui/NativeText';

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

type Props = {
	count: number;
	label: string;
	onPress?: () => void;
};

function ProfileStatItemView({ count, label, onPress }: Props) {
	const { theme } = useAppTheme();
	function _onPress() {
		if (onPress) onPress();
	}
	return (
		<Pressable style={[{}, styles.touchContainer]} onPress={_onPress}>
			<NativeTextH6 style={{ color: theme.complementary.a0 }}>
				{util(count)}
			</NativeTextH6>
			<AppText.Medium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				style={[{ fontSize: 13 }]}
				numberOfLines={1}
			>
				{label}
			</AppText.Medium>
		</Pressable>
	);
}

export default ProfileStatItemView;

const styles = StyleSheet.create({
	touchContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
	},
});
