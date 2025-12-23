import { useAppTheme } from '#/states/global/hooks';
import {
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { AppThemingUtil } from '#/utils/theming.util';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { NativeTextMedium } from '#/ui/NativeText';

type ToggleReplyVisibilityProps = {
	enabled: boolean;
	expanded: boolean;
	onPress: () => void;
	count: number;
	style?: StyleProp<ViewStyle>;
};

export function ToggleReplyVisibility({
	enabled,
	expanded,
	onPress,
	count,
	style,
}: ToggleReplyVisibilityProps) {
	const { theme } = useAppTheme();
	if (!enabled) return <View />;

	const EXPANDED_COLOR = theme.complementary;
	const COLLAPSED_COLOR = theme.primary;

	return (
		<Pressable style={[styles.actionButton, style]} onPress={onPress}>
			<View style={{ width: 16, marginRight: 4 }}>
				{expanded ? (
					<FontAwesome6 name="square-minus" size={16} color={EXPANDED_COLOR} />
				) : (
					<FontAwesome6 name="plus-square" size={16} color={COLLAPSED_COLOR} />
				)}
			</View>
			<NativeTextMedium
				style={{
					color: expanded ? theme.complementary : theme.primary,
				}}
			>
				{count} replies
			</NativeTextMedium>
		</Pressable>
	);
}

export function ToggleMediaVisibility({
	enabled,
	expanded,
	onPress,
	count,
	style,
}: ToggleReplyVisibilityProps) {
	const { theme } = useAppTheme();
	if (!enabled) return <View />;

	const EXPANDED_COLOR = AppThemingUtil.getThreadColorForDepth(0);
	const COLLAPSED_COLOR = theme.complementary;

	return (
		<Pressable style={[styles.actionButton, style]} onPress={onPress}>
			<View style={{ width: 24 }}>
				<FontAwesome6
					name="image"
					size={20}
					color={expanded ? EXPANDED_COLOR : COLLAPSED_COLOR}
				/>
			</View>
			{expanded ? (
				<NativeTextMedium style={{ color: EXPANDED_COLOR, marginLeft: 4 }}>
					Shown ({count})
				</NativeTextMedium>
			) : (
				<NativeTextMedium style={{ color: COLLAPSED_COLOR, marginLeft: 4 }}>
					Hidden ({count})
				</NativeTextMedium>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 6,
		borderRadius: 8,
	},
});
