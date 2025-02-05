import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { View, StyleSheet } from 'react-native';
import { BottomNavBar } from '../../../components/shared/pager-view/BottomNavBar';
import MentionPresenter from './MentionPresenter';
import ChatroomPresenter from './ChatroomPresenter';
import SocialUpdatePresenter from './SocialUpdatePresenter';
import UpdatesPresenter from './UpdatesPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import WithInboxCategoryCtx from '../contexts/useInboxCategoryCtx';

const renderScene = (index: number) => {
	switch (index) {
		case 0:
			return (
				<WithInboxCategoryCtx>
					<MentionPresenter />
				</WithInboxCategoryCtx>
			);
		case 1:
			return (
				<WithInboxCategoryCtx>
					<ChatroomPresenter />
				</WithInboxCategoryCtx>
			);
		case 2:
			return (
				<WithInboxCategoryCtx>
					<SocialUpdatePresenter />;
				</WithInboxCategoryCtx>
			);
		case 3:
			return (
				<WithInboxCategoryCtx>
					<UpdatesPresenter />
				</WithInboxCategoryCtx>
			);
		default:
			return <View />;
	}
};

function InboxPresenter() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const [TabIndex, setTabIndex] = useState(0);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const ref = useRef<PagerView>(null);

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.INBOX} />;

	/**
	 *	---- User Logged In ----
	 */

	const tabLabels = [
		{
			label: t(`inbox.nav.mentions`),
			id: 'mentions',
		},
		{
			label: t(`inbox.nav.chat`),
			id: 'social',
		},
		{
			label: t(`inbox.nav.social`),
			id: 'chat',
		},
		{
			label: t(`inbox.nav.updates`),
			id: 'updates',
		},
	];

	function onChipSelected(index: number) {
		if (TabIndex !== index) {
			ref.current.setPage(index);
		}
	}

	function onPagerViewScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setTabIndex(nextIdx);
	}

	return (
		<View style={[styles.root, { backgroundColor: theme.background.a0 }]}>
			<PagerView
				ref={ref}
				scrollEnabled={false}
				style={{ flex: 1 }}
				initialPage={TabIndex}
				onPageScroll={onPagerViewScroll}
			>
				{Array.from({ length: tabLabels.length }).map((_, index) => (
					<View key={index} style={{ flex: 1 }}>
						{renderScene(index)}
					</View>
				))}
			</PagerView>
			<BottomNavBar
				Index={TabIndex}
				setIndex={onChipSelected}
				items={tabLabels}
			/>
		</View>
	);
}

export default InboxPresenter;

const styles = StyleSheet.create({
	root: {
		height: '100%',
		position: 'relative',
	},
});
