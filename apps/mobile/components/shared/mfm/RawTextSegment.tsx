import { Text } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { TEXT_PARSING_VARIANT } from '#/types/app.types';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';

type Props = {
	value: string;
	variant: TEXT_PARSING_VARIANT;
};

function RawTextSegment({ value, variant }: Props) {
	const _value = value?.replaceAll(/<br>/g, '\n');
	const { theme } = useAppTheme();

	if (!_value) return <Text></Text>;

	if (variant === 'displayName')
		return (
			<NativeTextBold
				style={{
					color: theme.secondary.a0,
					fontSize: 16,
				}}
				numberOfLines={variant === 'displayName' ? 1 : undefined}
			>
				{_value}
			</NativeTextBold>
		);
	return (
		<NativeTextNormal
			style={{
				color: theme.secondary.a0,
			}}
			emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
		>
			{_value}
		</NativeTextNormal>
	);
}

export default RawTextSegment;
