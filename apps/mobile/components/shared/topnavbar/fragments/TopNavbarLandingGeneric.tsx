import { memo } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import AppSelectedAccountIndicator from './AppSelectedAccountIndicator';
import TopNavbarMenuButton from './TopNavbarMenuButton';

type HeadersProps = {
	title: string;
};

const TopNavbarLandingGeneric = memo(({ title }: HeadersProps) => {
	return (
		<View style={styles.subHeader}>
			<TopNavbarMenuButton />
			<View style={styles.navbarTitleContainer}>
				<Text style={styles.navbarTitle}>{title}</Text>
			</View>
			<AppSelectedAccountIndicator />
		</View>
	);
});

export default TopNavbarLandingGeneric;
