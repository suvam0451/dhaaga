import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { appDimensions } from '#/styles/dimensions';
import { ScrollView } from 'react-native';

type Props = {
	label: string;
	children: any;
};

function SettingPageBuilder({ label, children }: Props) {
	const { theme } = useAppTheme();
	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();

	return (
		<>
			<NavBar_Simple label={label} animatedStyle={animatedStyle} />
			<ScrollView
				style={{
					paddingHorizontal: 16,
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
