import { Text, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import {
	BebasNeue_400Regular,
	DMSans_500Medium,
	Figtree_400Regular,
	Lato_400Regular,
	Lexend_400Regular,
	Nunito_400Regular,
	Poppins_400Regular,
	PublicSans_400Regular,
	SpaceGrotesk_400Regular,
	useFonts,
} from '@expo-google-fonts/dev';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

type HeadersProps = {
	title: string;
};
const TopNavbarGeneric = ({ title }: HeadersProps) => {
	const { theme } = useAppTheme();

	const [loaded, error] = useFonts({
		Poppins_400Regular: Poppins_400Regular,
		Lato_400Regular: Lato_400Regular,
		Nunito_400Regular: Nunito_400Regular,
		Lexend_400Regular: Lexend_400Regular,
		DMSans_500Medium: DMSans_500Medium,
		PublicSans_400Regular: PublicSans_400Regular,
		SpaceGrotesk_400Regular: SpaceGrotesk_400Regular,
		Figtree_400Regular: Figtree_400Regular,
		BebasNeue_400Regular: BebasNeue_400Regular,
	});

	return (
		<View style={[styles.subHeader, { backgroundColor: theme.palette.bg }]}>
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<Text
					style={[
						styles.navbarTitle,
						{
							color: theme.textColor.medium,
							// fontFamily: 'BebasNeue_400Regular',
							// fontSize: 24,
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
