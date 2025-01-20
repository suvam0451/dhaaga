import { StatusBar, Text, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

type HeadersProps = {
	title: string;
};
const TopNavbarGeneric = ({ title }: HeadersProps) => {
	const { theme } = useAppTheme();

	return (
		<View style={[styles.subHeader, { backgroundColor: theme.background.a0 }]}>
			<StatusBar backgroundColor={theme.background.a0} />
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text
					style={[
						styles.navbarTitle,
						{
							color: theme.textColor.medium,
						},
					]}
				>
					{title}
				</Text>
			</View>
			<View style={{ width: 36 }}></View>
		</View>
	);
};

export default TopNavbarGeneric;
