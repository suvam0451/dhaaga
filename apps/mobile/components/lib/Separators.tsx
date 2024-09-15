import { View } from 'react-native';
import { memo } from 'react';

type AppSeparatorProps = {
	color: string;
};

export const AppSeparator = memo(({ color }: AppSeparatorProps) => {
	return (
		<View
			style={{
				height: 1,
				backgroundColor: color || '#404040',
				marginVertical: 8,
			}}
		/>
	);
});
