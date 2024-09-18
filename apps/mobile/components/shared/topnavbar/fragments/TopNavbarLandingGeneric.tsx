import { memo } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import AppSelectedAccountIndicator from './AppSelectedAccountIndicator';
import TopNavbarMenuButton from './TopNavbarMenuButton';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

type HeadersProps = {
	title: string;
};

const TopNavbarLandingGeneric = memo(({ title }: HeadersProps) => {
	const { colorScheme } = useAppTheme();
	return (
		<View
			style={[
				styles.subHeader,
				{ backgroundColor: colorScheme.palette.menubar },
			]}
		>
			<TopNavbarMenuButton />
			<View style={styles.navbarTitleContainer}>
				<Text
					style={[styles.navbarTitle, { color: colorScheme.textColor.high }]}
				>
					{title}
				</Text>
			</View>
			<AppSelectedAccountIndicator />
		</View>
	);
});

export default TopNavbarLandingGeneric;
