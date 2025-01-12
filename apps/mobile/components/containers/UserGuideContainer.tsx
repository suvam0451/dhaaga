import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import {
	ScrollView,
	StyleProp,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../shared/topnavbar/AppTopNavbar';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';
import { AppText } from '../lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';

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
		marginBottom: 8,
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
						<Text
							style={[
								qStyle,
								{
									fontFamily: 'BebasNeue_400Regular',
									fontSize: 24,
									color: theme.primary.a0,
								},
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<AppText.Normal
								key={i}
								style={{
									color: theme.secondary.a10,
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

export default UserGuideContainer;
