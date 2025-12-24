import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { FlatList, View } from 'react-native';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';
import { NativeTextBold } from '#/ui/NativeText';

function Page() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const history = [];
	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();
	const { theme } = useAppTheme();
	return (
		<>
			<NavBar_Simple
				label={t(`topNav.secondary.searchHistory`)}
				animatedStyle={animatedStyle}
			/>
			<FlatList
				data={history}
				onScroll={scrollHandler}
				renderItem={({ item }) => <div>{item}</div>}
				style={{ backgroundColor: theme.background.a0 }}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 16,
				}}
				ListEmptyComponent={
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 32,
						}}
					>
						<NativeTextBold>{t(`unspecced.wipText`)}</NativeTextBold>
					</View>
				}
			/>
		</>
	);
}

export default Page;
