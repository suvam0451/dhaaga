import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { AppText } from './Text';
import { AppIcon } from './Icon';

type Props = {
	label: string;
	checked: boolean;
	onClick: () => void;
};

/**
 * Stylized checkbox,
 * that turn white and add a
 * cross sign at end
 */
export function InlineCheckboxView({ label, checked, onClick }: Props) {
	const { theme } = useAppTheme();

	const _activeForeground = 'black';
	const _activeBackground = theme.complementary.a0;
	const _inactiveForeground = theme.secondary.a20;
	const _inactiveBackground = '#2c2c2c';

	return (
		<View
			style={{
				borderRadius: 8,
				backgroundColor: checked ? _activeBackground : _inactiveBackground,
				padding: 8,
				marginRight: 8,
				flex: 0,
				flexDirection: 'row',
				alignItems: 'center',
			}}
			onTouchEnd={onClick}
		>
			<AppText.SemiBold
				style={{
					color: checked ? _activeForeground : _inactiveForeground,
					paddingHorizontal: 8,
				}}
			>
				{label}
			</AppText.SemiBold>
			{checked && (
				<View style={{ marginLeft: 4 }}>
					<AppIcon id="close" size={18} color={'black'} />
				</View>
			)}
		</View>
	);
}
