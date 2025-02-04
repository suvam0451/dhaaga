import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';

type ButtonVariant = 'cta' | 'warm' | 'info' | 'warn' | 'error';

export type RelationshipButtonProps = {
	loading: boolean;
	onPress: () => void;
	label: string;
	variant: ButtonVariant;
};

function CurrentRelationView({
	loading,
	onPress,
	label,
	variant,
}: RelationshipButtonProps) {
	const { theme } = useAppTheme();

	const bgColor: Record<ButtonVariant, string> = {
		error: 'red',
		cta: theme.primary.a0,
		info: theme.background.a20,
		warn: 'orange',
		warm: 'transparent',
	};

	const fgColor: Record<ButtonVariant, string> = {
		error: 'red',
		cta: 'black',
		info: theme.complementary.a0,
		warn: 'orange',
		warm: theme.primary.a0,
	};

	return (
		<Pressable
			onPress={onPress}
			style={[
				styles.button,
				{
					backgroundColor: bgColor[variant],
				},
			]}
		>
			{loading ? (
				<ActivityIndicator size={20} color={fgColor[variant]} />
			) : (
				<AppText.Medium
					style={[
						{ color: fgColor[variant], fontSize: 16, textAlign: 'center' },
					]}
				>
					{label}
				</AppText.Medium>
			)}
		</Pressable>
	);
}

export default CurrentRelationView;

const styles = StyleSheet.create({
	button: {
		borderRadius: appDimensions.buttons.borderRadius,
		paddingVertical: 8,
		flex: 1,
	},
});
