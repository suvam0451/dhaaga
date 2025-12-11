import { StyleProp, View, ViewStyle, FlatList } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { AppText, SpecialText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';

export type UserGuideContainerProps = {
	questionnaire: { question: string; answers: string[] }[];
	label: string;
};

function GuidePageBuilder({ questionnaire, label }: UserGuideContainerProps) {
	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();
	const { theme } = useAppTheme();

	const sectionStyle: StyleProp<ViewStyle> = {
		marginBottom: 16,
	};

	return (
		<>
			<NavBar_Simple label={label} animatedStyle={animatedStyle} />
			<FlatList
				style={{
					backgroundColor: theme.palette.bg,
				}}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 8,
					paddingHorizontal: 10,
				}}
				data={questionnaire}
				onScroll={scrollHandler}
				renderItem={({ item }) => (
					<View style={sectionStyle}>
						<SpecialText
							style={[
								{
									color: theme.primary.a0,
									marginBottom: 8,
								},
							]}
						>
							{item.question}
						</SpecialText>
						{item.answers.map((answer, i) => (
							<AppText.Normal
								key={i}
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
				)}
			/>
		</>
	);
}

export default GuidePageBuilder;
