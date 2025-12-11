import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import { AppDivider } from '#/components/lib/Divider';
import { Fragment } from 'react';
import { View } from 'react-native';
import { AppText } from '#/components/lib/Text';

function Divider() {
	const { theme } = useAppTheme();
	return (
		<AppDivider.Hard
			style={{
				flex: 1,
				backgroundColor: theme.background.a50,
				marginTop: 16,
			}}
		/>
	);
}

type Props = {
	label: string;
	iconId: APP_ICON_ENUM;
};

function SectionHeader({ label, iconId }: Props) {
	const { theme } = useAppTheme();

	return (
		<Fragment>
			<View
				style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}
			>
				<AppIcon id={iconId} size={28} color={theme.primary} />
				<AppText.Medium
					style={{ fontSize: 18, color: theme.primary, marginLeft: 6 }}
				>
					{label}
				</AppText.Medium>
			</View>
			<Divider />
		</Fragment>
	);
}

export default SectionHeader;
