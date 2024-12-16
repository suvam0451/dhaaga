import { Text, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type HeadersProps = {
	title: string;
};
const TopNavbarGeneric = ({ title }: HeadersProps) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	return (
		<View style={[styles.subHeader, { backgroundColor: theme.palette.bg }]}>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text
					style={[styles.navbarTitle, { color: theme.textColor.emphasisC }]}
				>
					{title}
				</Text>
			</View>
			<View style={{ width: 36 }}></View>
		</View>
	);
};

export default TopNavbarGeneric;
