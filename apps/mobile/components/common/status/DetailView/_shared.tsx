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
import { AppText } from '../../../lib/Text';

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

	const EXPANDED_COLOR = AppThemingUtil.getThreadColorForDepth(0);
	const COLLAPSED_COLOR = theme.complementary;

	return (
		<Pressable style={[styles.actionButton, style]} onPress={onPress}>
			<View style={{ width: 24 }}>
				{expanded ? (
					<FontAwesome6 name="square-minus" size={20} color={EXPANDED_COLOR} />
				) : (
					<FontAwesome6 name="plus-square" size={20} color={COLLAPSED_COLOR} />
				)}
			</View>
			<AppText.Medium
				style={{
					color: expanded
						? AppThemingUtil.getThreadColorForDepth(0)
						: theme.complementary,
				}}
			>
				{count} replies
			</AppText.Medium>
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
				<AppText.Medium style={{ color: EXPANDED_COLOR, marginLeft: 4 }}>
					Shown ({count})
				</AppText.Medium>
			) : (
				<AppText.Medium style={{ color: COLLAPSED_COLOR, marginLeft: 4 }}>
					Hidden ({count})
				</AppText.Medium>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		marginLeft: -10,
		paddingVertical: 6,
		borderRadius: 8,
	},
});
