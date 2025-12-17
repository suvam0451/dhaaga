import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { useAppTheme } from '#/states/global/hooks';
import BrowsingHistoryEmpty from '#/components/svgs/BrowsingHistoryEmpty';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import { appDimensions } from '#/styles/dimensions';
import { FlatList } from 'react-native';

function Page() {
	const history = [];
	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple label={'Search History'} animatedStyle={animatedStyle} />
			<FlatList
				data={history}
				onScroll={scrollHandler}
				renderItem={({ item }) => <div>{item}</div>}
				style={{ backgroundColor: theme.background.a0 }}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 16,
				}}
				ListEmptyComponent={
					<ErrorPageBuilder
						stickerArt={<BrowsingHistoryEmpty />}
						errorMessage={'Move Along'}
						errorDescription={'Nothing to see here'}
					/>
				}
			/>
		</>
	);
}

export default Page;
