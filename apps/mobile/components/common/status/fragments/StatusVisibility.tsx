import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '#/states/global/hooks';

type StatusVisibilityProps = {
	visibility: string;
	size?: number;
};

/**
 * Post-visibility indicator
 */
function StatusVisibility({ size, visibility }: StatusVisibilityProps) {
	const { theme } = useAppTheme();
	switch (visibility) {
		case 'public':
			return (
				<Ionicons
					name="earth-outline"
					size={size || 16}
					color={theme.textColor.low}
				/>
			);
		case 'specified':
		case 'direct':
			return (
				<Ionicons
					name={'lock-closed-outline'}
					size={size || 16}
					color={theme.textColor.low}
				/>
			);
		case 'unlisted':
			return (
				<Ionicons
					name={'lock-open-outline'}
					size={size || 16}
					color={theme.textColor.low}
				/>
			);
		default:
			return (
				<Ionicons
					name="earth-outline"
					size={size || 16}
					color={theme.textColor.low}
				/>
			);
	}
}

export default StatusVisibility;
