import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { SocialHubPinSectionContainer } from './_factory';

type SocialHubPinnedProfilesProps = {
	style: StyleProp<ViewStyle>;
};

function SocialHubPinnedProfiles({ style }: SocialHubPinnedProfilesProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
	return (
		<SocialHubPinSectionContainer label={'Profiles'} style={style}>
			<View
				style={[
					styles.row,
					{
						marginBottom: 16,
					},
				]}
			>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
			</View>
			<View style={styles.row}>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
				<View
					style={[styles.item, { backgroundColor: theme.textColor.low }]}
				></View>
			</View>
		</SocialHubPinSectionContainer>
	);
}

export default SocialHubPinnedProfiles;

const styles = StyleSheet.create({
	root: {
		marginVertical: 24,
		marginHorizontal: 8,
	},
	sectionLabel: {
		// marginHorizontal: 8,
		marginBottom: 20,
		fontSize: 18,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
	},
	row: {
		flexDirection: 'row',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	item: {
		borderRadius: '100%',
		width: 64,
		height: 64,
		backgroundColor: 'red',
	},
});
