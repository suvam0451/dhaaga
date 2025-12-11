import { useAppTheme } from '#/states/global/hooks';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';

function LandingPageView() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const instructions = t(`discover.instructions`, {
		returnObjects: true,
	}) as string[];
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
					paddingBottom: 128,
				}}
			>
				<Text
					style={[
						styles.bodyText,
						{
							color: theme.secondary.a10,
							marginBottom: 32,
							fontSize: 20,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						},
					]}
				>
					{t(`discover.moreSoon.firstHalf`)}{' '}
					<Text style={{ color: theme.complementary.a0 }}>
						{t(`discover.moreSoon.secondHalf`)}
					</Text>
				</Text>
				{instructions.map((o, i) => (
					<Text
						key={i}
						style={[styles.bodyText, { color: theme.secondary.a10 }]}
					>
						{o}
					</Text>
				))}
			</View>
		</View>
	);
}

export default LandingPageView;

const styles = StyleSheet.create({
	bodyText: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 16,
		textAlign: 'left',
		marginBottom: 8,
	},
});
