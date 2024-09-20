import { Text, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

type HeadersProps = {
	title: string;
};
const TopNavbarGeneric = ({ title }: HeadersProps) => {
	const { colorScheme } = useAppTheme();
	return (
		<View
			style={[
				styles.subHeader,
				{ backgroundColor: colorScheme.palette.menubar },
			]}
		>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text
					style={[styles.navbarTitle, { color: colorScheme.textColor.high }]}
				>
					{title}
				</Text>
			</View>
			<View style={{ width: 36 }}></View>
		</View>
	);
};

export default TopNavbarGeneric;
