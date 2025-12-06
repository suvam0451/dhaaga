import { AppText } from '#/components/lib/Text';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useHideTopNavUsingReanimated from '#/hooks/anim/useHideTopNavUsingReanimated';
import { FlatList, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

function Page() {
	const { theme } = useAppTheme();
	const { scrollHandler, animatedStyle } = useHideTopNavUsingReanimated();

	return (
		<>
			<NavBar_Simple label={'Drafts'} animatedStyle={animatedStyle} />
			<FlatList
				data={[]}
				renderItem={({ item }) => <></>}
				ListHeaderComponent={
					<View>
						<AppText.Medium>
							This feature has not been implemented yet
						</AppText.Medium>
					</View>
				}
				style={{
					backgroundColor: theme.background.a0,
				}}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					paddingHorizontal: 10,
				}}
			/>
		</>
	);
}

export default Page;
