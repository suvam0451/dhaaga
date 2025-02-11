import StatusItem from '../../../common/status/StatusItem';
import { useMemo, useState } from 'react';
import { Animated, FlatList, RefreshControl, View } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useLocalSearchParams } from 'expo-router';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import useGetStatusCtxInterface from '../../../../hooks/api/statuses/useGetStatusCtxInterface';
import WithAppStatusContextDataContext, {
	useAppStatusContextDataContext,
} from '../../../../hooks/api/statuses/WithAppStatusContextData';
import PostReply from '../../../../features/posts/features/detail-view/presenters/ReplyItemPresenter';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';
import { AppText } from '../../../lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';

function ReplySection() {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);
	return (
		<View
			style={{
				flexDirection: 'row',
				paddingHorizontal: 10,
				backgroundColor: theme.background.a40,
				paddingVertical: 6,
			}}
		>
			<AppText.SemiBold
				style={{
					color: theme.secondary.a20,
					fontSize: 18,
				}}
			>
				{t(`noun.reply_other`)}
			</AppText.SemiBold>
		</View>
	);
}

function StatusContextComponent() {
	const { data, getChildren } = useAppStatusContextDataContext();
	const children = useMemo(() => {
		return getChildren(data.root);
	}, [data]);

	if (!data.root) return <View />;
	const rootObject = data.lookup.get(data.root);

	return (
		<View>
			<WithAppStatusItemContext dto={rootObject}>
				<StatusItem showFullDetails />
			</WithAppStatusItemContext>
			<ReplySection />
			<FlatList
				data={children}
				renderItem={({ item }) => <PostReply colors={[]} lookupId={item.id} />}
				contentContainerStyle={{ marginTop: 24 }}
			/>
			<AppText.Medium
				style={{ textAlign: 'center', marginVertical: 16 }}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
			>
				No more replies
			</AppText.Medium>
		</View>
	);
}

function SharedStackPostDetails() {
	const [refreshing, setRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

	const { id, uri } = useLocalSearchParams<{ id: string; uri: string }>();
	const { Data, dispatch, refetch } = useGetStatusCtxInterface(
		id === 'uri' ? uri : id,
	);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={t(`noun.post_one`)} translateY={translateY}>
			<WithAppStatusContextDataContext data={Data} dispatch={dispatch}>
				<Animated.ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={refetch} />
					}
					contentContainerStyle={{
						paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					}}
					onScroll={onScroll}
				>
					<StatusContextComponent />
				</Animated.ScrollView>
			</WithAppStatusContextDataContext>
		</WithAutoHideTopNavBar>
	);
}

export default SharedStackPostDetails;
