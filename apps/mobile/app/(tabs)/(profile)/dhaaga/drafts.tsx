import { AppText } from '#/components/lib/Text';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { FlatList, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme } from '#/states/global/hooks';

function Page() {
	const { theme } = useAppTheme();
	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();

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
