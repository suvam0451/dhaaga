import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../components/shared/topnavbar/fragments/TopNavbarTimelineStack';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { AppText } from '../../../components/lib/Text';
import { appDimensions } from '../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';

type Props = {
	error: any;
};

function TimelineErrorView({ error }: Props) {
	const { theme } = useAppTheme();
	const { translateY } = useScrollMoreOnPageEnd();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader />
			</Animated.View>
			<View
				style={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					paddingHorizontal: 20,
				}}
			>
				<AppText.SemiBold
					style={{ textAlign: 'center', marginTop: 24, fontSize: 24 }}
				>
					{t(`errors.errorLabel`)}
				</AppText.SemiBold>
				<AppText.Medium
					style={{ textAlign: 'center', marginVertical: 16 }}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				>
					{t(`errors.timelineErrorLabel`)}
				</AppText.Medium>
				<AppText.Medium
					style={{ color: theme.complementary.a0, textAlign: 'center' }}
				>
					{error?.toString()}
				</AppText.Medium>
			</View>
		</View>
	);
}

export default TimelineErrorView;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
		position: 'relative',
	},
});
