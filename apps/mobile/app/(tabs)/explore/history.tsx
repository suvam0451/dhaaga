import { AnimatedFlashList } from '@shopify/flash-list';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useHideTopNavUsingFlashList from '#/hooks/anim/useHideTopNavUsingFlashList';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import BrowsingHistoryEmpty from '#/components/svgs/BrowsingHistoryEmpty';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import { appDimensions } from '#/styles/dimensions';

function Page() {
	const history = [];
	const { scrollHandler, animatedStyle } = useHideTopNavUsingFlashList();
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple label={'Search History'} animatedStyle={animatedStyle} />
			<AnimatedFlashList
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
