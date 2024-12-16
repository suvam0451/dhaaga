import { memo, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type StatusVisibilityProps = {
	visibility: string;
	color?: string;
	size?: number;
};

/**
 * Post visibility indicator
 */
const StatusVisibility = memo(
	({ color, size, visibility }: StatusVisibilityProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);
		return useMemo(() => {
			switch (visibility) {
				case 'public':
					return (
						<Ionicons
							name="earth-outline"
							size={size || 16}
							color={theme.textColor.low || 'rgba(136,136,136,0.6)'}
						/>
					);
				case 'specified':
				case 'direct':
					return (
						<Ionicons
							name={'lock-closed-outline'}
							size={size || 16}
							color={theme.textColor.low || 'rgba(136,136,136,0.6)'}
						/>
					);
				case 'unlisted':
					return (
						<Ionicons
							name={'lock-open-outline'}
							size={size || 16}
							color={theme.textColor.low || 'rgba(136,136,136,0.6)'}
						/>
					);
				default:
					return (
						<Ionicons
							name="earth-outline"
							size={size || 16}
							color={theme.textColor.low || 'rgba(136,136,136,0.6)'}
						/>
					);
			}
		}, [visibility, theme]);
	},
);

export default StatusVisibility;
