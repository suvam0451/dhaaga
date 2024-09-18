import { Text, View } from 'react-native';
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
			<View style={{ width: 36 }}></View>
			{/*<AppSelectedAccountIndicator />*/}
		</View>
	);
};

export default TopNavbarGeneric;
