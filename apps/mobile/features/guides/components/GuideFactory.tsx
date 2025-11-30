import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import {
	ScrollView,
	StyleProp,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

export type UserGuideContainerProps = {
	questionnaire: { question: string; answers: string[] }[];
	label: string;
};

function GuideFactory({ questionnaire, label }: UserGuideContainerProps) {
	const { translateY } = useScrollMoreOnPageEnd({});
	const { theme } = useAppTheme();

	const sectionStyle: StyleProp<ViewStyle> = {
		marginBottom: 16,
	};

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={label}
			translateY={translateY}
		>
			<ScrollView contentContainerStyle={styles.scrollView}>
				{questionnaire.map((block, i) => (
					<View key={i} style={sectionStyle}>
						<AppText.Special
							style={[
								{
									color: theme.primary.a0,
									marginBottom: 8,
								},
							]}
						>
							{block.question}
						</AppText.Special>
						{block.answers.map((answer, i) => (
							<AppText.Normal
								forwardedKey={i}
								style={{
									color: theme.secondary.a10,
									fontSize: 14,
									marginBottom: 4,
								}}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								{answer}
							</AppText.Normal>
						))}
					</View>
				))}
			</ScrollView>
		</AppTopNavbar>
	);
}

export default GuideFactory;

const styles = StyleSheet.create({
	scrollView: {
		paddingTop: 12,
		paddingHorizontal: 10,
	},
});
