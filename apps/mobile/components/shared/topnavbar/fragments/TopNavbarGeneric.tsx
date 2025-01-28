import { StatusBar, View } from 'react-native';
import styles from './styles';
import TopNavbarBackButton from './TopNavbarBackButton';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../lib/Text';

type HeadersProps = {
	title: string;
};
/**
 * A generic navbar with a back button
 * @param title
 * @constructor
 */
function TopNavbarGeneric({ title }: HeadersProps) {
	const { theme } = useAppTheme();

	return (
		<View style={[styles.subHeader, { backgroundColor: theme.background.a0 }]}>
			<StatusBar backgroundColor={theme.background.a0} />
			<TopNavbarBackButton />
			<View style={styles.navbarTitleContainer}>
				<AppText.SemiBold
					style={{
						fontSize: 16,
						color: theme.secondary.a10,
					}}
				>
					{title}
				</AppText.SemiBold>
			</View>
			<View style={{ width: 36 }}></View>
		</View>
	);
}

export default TopNavbarGeneric;
