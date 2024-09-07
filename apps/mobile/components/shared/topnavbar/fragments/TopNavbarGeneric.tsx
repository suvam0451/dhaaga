import { Text, View } from 'react-native';
import AppSelectedAccountIndicator from './AppSelectedAccountIndicator';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';

type HeadersProps = {
	title: string;
};
const TopNavbarGeneric = ({ title }: HeadersProps) => {
	return (
		<View style={styles.subHeader}>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text style={styles.navbarTitle}>{title}</Text>
			</View>
			<AppSelectedAccountIndicator />
		</View>
	);
};

export default TopNavbarGeneric;
