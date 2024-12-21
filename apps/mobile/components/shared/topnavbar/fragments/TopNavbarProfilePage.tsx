import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import Feather from '@expo/vector-icons/Feather';
import { APP_FONT } from '../../../../styles/AppTheme';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type HeadersProps = {
	title: string;
};
const TopNavbarProfilePage = ({ title }: HeadersProps) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<View
			style={[styles.subHeader, { backgroundColor: theme.palette.menubar }]}
		>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text style={[styles.navbarTitle, { color: theme.textColor.high }]}>
					{title}
				</Text>
			</View>
			<TouchableOpacity style={{ width: 36 }}>
				<Feather
					name="more-horizontal"
					size={24}
					color={APP_FONT.HIGH_EMPHASIS}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default TopNavbarProfilePage;
