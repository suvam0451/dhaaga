import { StyleProp, View, ViewStyle, FlatList } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { NativeTextNormal, NativeTextSpecial } from '#/ui/NativeText';

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
					backgroundColor: theme.background.a0,
				}}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 8,
					paddingHorizontal: 10,
				}}
				data={questionnaire}
				onScroll={scrollHandler}
				renderItem={({ item }) => (
					<View style={sectionStyle}>
						<NativeTextSpecial
							style={[
								{
									color: theme.primary,
									marginBottom: 4,
								},
							]}
						>
							{item.question}
						</NativeTextSpecial>
						{item.answers.map((answer, i) => (
							<NativeTextNormal
								key={i}
								style={{
									color: theme.secondary.a10,
									fontSize: 15,
									marginBottom: 2,
								}}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								{answer}
							</NativeTextNormal>
						))}
					</View>
				)}
			/>
		</>
	);
}

export default GuidePageBuilder;
