import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import Feather from '@expo/vector-icons/Feather';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useGorhomActionSheetContext } from '../../../../states/useGorhomBottomSheet';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

type HeadersProps = {
	title: string;
};
const TopNavbarProfilePage = ({ title }: HeadersProps) => {
	const { setVisible } = useGorhomActionSheetContext();
	const { colorScheme } = useAppTheme();

	function onMoreOptionsClicked() {
		setVisible(true);
	}

	return (
		<View
			style={[
				styles.subHeader,
				{ backgroundColor: colorScheme.palette.menubar },
			]}
		>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text style={styles.navbarTitle}>{title}</Text>
			</View>
			<TouchableOpacity style={{ width: 36 }} onPress={onMoreOptionsClicked}>
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
