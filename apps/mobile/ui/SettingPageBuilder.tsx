import { useAppTheme } from '#/states/global/hooks';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import { ScrollView } from 'react-native';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';

type Props = {
	label: string;
	children: any;
};

function SettingPageBuilder({ label, children }: Props) {
	const { theme } = useAppTheme();
	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	return (
		<>
			<NavBar_Simple label={label} animatedStyle={animatedStyle} />
			<ScrollView
				style={{
					paddingHorizontal: 10,
					backgroundColor: theme.background.a0,
				}}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				onScroll={scrollHandler}
			>
				{children}
			</ScrollView>
		</>
	);
}

export default SettingPageBuilder;
