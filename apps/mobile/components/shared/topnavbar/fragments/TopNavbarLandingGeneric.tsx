import { memo } from 'react';
import { Text, View } from 'react-native';
import styles from './styles';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../../states/_global';

type HeadersProps = {
	title: string;
};

const TopNavbarLandingGeneric = memo(({ title }: HeadersProps) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	return (
		<View
			style={[styles.subHeader, { backgroundColor: theme.palette.menubar }]}
		>
			<View style={styles.navbarTitleContainer}>
				<Text style={[styles.navbarTitle, { color: theme.textColor.high }]}>
					{title}
				</Text>
			</View>
		</View>
	);
});

export default TopNavbarLandingGeneric;
