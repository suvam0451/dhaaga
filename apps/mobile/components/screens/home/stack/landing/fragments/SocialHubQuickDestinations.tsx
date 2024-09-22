import { Fragment, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppIcon } from '../../../../../lib/Icon';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

const SocialHubQuickDestinations = memo(() => {
	const { colorScheme } = useAppTheme();
	return (
		<Fragment>
			<Text
				style={{
					color: colorScheme.textColor.emphasisC,
					marginLeft: 8,
					marginTop: 32,
					marginBottom: 8,
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
				}}
			>
				Quick Destinations
			</Text>
			<View style={{ flexDirection: 'row', overflow: 'scroll' }}>
				<View
					style={[
						styles.button,
						{ backgroundColor: colorScheme.palette.menubar },
					]}
				>
					<AppIcon id={'home'} />
					<Text style={[styles.text, { color: colorScheme.textColor.medium }]}>
						Home
					</Text>
				</View>
				<View
					style={[
						styles.button,
						{ backgroundColor: colorScheme.palette.menubar },
					]}
				>
					<AppIcon id={'home'} />
					<Text style={[styles.text, { color: colorScheme.textColor.medium }]}>
						Social
					</Text>
				</View>
			</View>
		</Fragment>
	);
});
export default SocialHubQuickDestinations;

const styles = StyleSheet.create({
	text: { marginTop: 6 },
	button: {
		padding: 8,
		paddingHorizontal: 12,
		marginRight: 8,
		borderRadius: 8,
	},
});
