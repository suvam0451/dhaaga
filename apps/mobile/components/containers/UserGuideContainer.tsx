import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import {
	ScrollView,
	StyleProp,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '../../styles/AppFonts';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../shared/topnavbar/AppTopNavbar';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

type UserGuideContainerProps = {
	questionnaire: { question: string; answers: string[] }[];
	language: string;
	label: string;
};

function UserGuideContainer({ questionnaire, label }: UserGuideContainerProps) {
	const { translateY } = useScrollMoreOnPageEnd({});
	const { theme } = useAppTheme();

	const sectionStyle: StyleProp<ViewStyle> = {
		marginBottom: 16,
	};

	const qStyle: StyleProp<TextStyle> = {
		color: theme.secondary.a0,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginBottom: 8,
		fontSize: 16,
	};

	const aStyle: StyleProp<TextStyle> = {
		color: theme.secondary.a10,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		marginBottom: 5,
		fontSize: 14,
	};

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={label}
			translateY={translateY}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54 + 12, paddingHorizontal: 10 }}
			>
				{questionnaire.map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text style={qStyle}>{block.question}</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text style={aStyle}>{answer}</Text>
							</View>
						))}
					</View>
				))}
			</ScrollView>
		</AppTopNavbar>
	);
}

export default UserGuideContainer;
