import { memo, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
		return useMemo(() => {
			switch (visibility) {
				case 'public':
					return (
						<Ionicons
							name="earth-outline"
							size={size || 16}
							color={color || 'rgba(136,136,136,0.6)'}
						/>
					);
				case 'specified':
				case 'direct':
					return (
						<Ionicons
							name={'lock-closed-outline'}
							size={size || 16}
							color={color || 'rgba(136,136,136,0.6)'}
						/>
					);
				case 'unlisted':
					return (
						<Ionicons
							name={'lock-open-outline'}
							size={size || 16}
							color={color || 'rgba(136,136,136,0.6)'}
						/>
					);
				default:
					return (
						<Ionicons
							name="earth-outline"
							size={size || 16}
							color={color || 'rgba(136,136,136,0.6)'}
						/>
					);
			}
		}, [visibility]);
	},
);

export default StatusVisibility;
