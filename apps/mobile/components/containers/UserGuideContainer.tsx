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
import {
	useFonts,
	Nunito_400Regular,
	Lato_400Regular,
	Inter_900Black,
	Poppins_400Regular,
	DMSans_400Regular,
	DMSans_700Bold,
	Lexend_400Regular,
	Roboto_400Regular,
	NunitoSans_400Regular,
	DMSans_500Medium,
	Raleway_400Regular,
	OpenSans_400Regular,
	PublicSans_400Regular,
	SpaceGrotesk_400Regular,
	Figtree_400Regular,
	BebasNeue_400Regular,
	Poppins_500Medium,
	FiraSans_400Regular,
	SourceSansPro_400Regular,
	SourceSans3_400Regular,
	IBMPlexSans_400Regular,
	Lato_400Regular_Italic,
	Lora_400Regular,
} from '@expo-google-fonts/dev';

// DMSans, Lexend, Raleway, OpenSans,SpaceGrotesk

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
		color: theme.secondary.a20,
		// fontFamily: APP_FONTS.INTER_400_REGULAR,
		// fontWeight: 'normal',
		marginBottom: 5,
		fontSize: 14,
	};

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
		Poppins_500Medium: Poppins_500Medium,
		FiraSans_400Regular: FiraSans_400Regular,
		SourceSansPro_400Regular: SourceSansPro_400Regular,
		SourceSans3_400Regular: SourceSans3_400Regular,
		IBMPlexSans_400Regular: IBMPlexSans_400Regular,
		Lato_400Regular_Italic: Lato_400Regular_Italic,
		Roboto: Roboto_400Regular,
		Lora_400Regular: Lora_400Regular,
		OpenSans_400Regular: OpenSans_400Regular,
	});

	if (!loaded || error) return <View />;

	const fonts = [
		APP_FONTS.INTER_400_REGULAR,
		'Lato_400Regular',
		'PublicSans_400Regular',
		'Nunito_400Regular',
		'Poppins_400Regular',
	];
	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={label}
			translateY={translateY}
		>
			<ScrollView
				contentContainerStyle={{ paddingTop: 54 + 12, paddingHorizontal: 10 }}
			>
				{questionnaire.slice(0, 1).map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text
							style={[
								qStyle,
								{
									fontFamily: 'BebasNeue_400Regular',
									fontSize: 22,
									color: theme.secondary.a10,
								},
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text
									style={[
										aStyle,
										{
											fontFamily: 'OpenSans_400Regular',
											color: theme.primary.a0,
											fontSize: 14,
										},
									]}
								>
									{answer}
								</Text>
							</View>
						))}
					</View>
				))}
				{questionnaire.slice(0, 1).map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text
							style={[
								qStyle,
								{
									fontFamily: 'BebasNeue_400Regular',
									fontSize: 22,
									color: theme.secondary.a10,
								},
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text
									style={[aStyle, { fontSize: 14, color: theme.primary.a0 }]}
								>
									{answer}
								</Text>
							</View>
						))}
					</View>
				))}
				{questionnaire.slice(0, 1).map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text
							style={[
								qStyle,
								{
									fontFamily: 'BebasNeue_400Regular',
									fontSize: 22,
									color: theme.secondary.a10,
								},
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text
									style={[
										aStyle,
										{
											fontFamily: 'SourceSansPro_400Regular',
											color: theme.primary.a0,
										},
									]}
								>
									{answer}
								</Text>
							</View>
						))}
					</View>
				))}
				{questionnaire.slice(0, 1).map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text
							style={[
								qStyle,
								{ fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text
									style={[aStyle, { fontFamily: APP_FONTS.INTER_400_REGULAR }]}
								>
									{answer}
								</Text>
							</View>
						))}
					</View>
				))}
				{questionnaire.slice(0, 1).map((block, i) => (
					<View key={i} style={sectionStyle}>
						<Text
							style={[
								qStyle,
								{ fontFamily: 'BebasNeue_400Regular', fontSize: 22 },
							]}
						>
							{block.question}
						</Text>
						{block.answers.map((answer, i) => (
							<View key={i}>
								<Text
									style={[
										aStyle,
										{
											fontFamily: 'Lato_400Regular',
											color: theme.primary.a0,
										},
									]}
								>
									{answer}
								</Text>
							</View>
						))}
					</View>
				))}
			</ScrollView>
		</AppTopNavbar>
	);
}

export default UserGuideContainer;
