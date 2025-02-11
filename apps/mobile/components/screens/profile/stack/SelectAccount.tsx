import {
	FlatList,
	RefreshControl,
	View,
	Text,
	Pressable,
	StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import AccountListForSoftware from './landing/fragments/AccountListForSoftware';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../shared/topnavbar/AppTopNavbar';
import { Account } from '../../../../database/_schema';
import { AccountService } from '../../../../database/entities/account';
import {
	useAppDb,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_EVENT_ENUM } from '../../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { appDimensions } from '../../../../styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../types/app.types';

function SelectAccountStack() {
	const { theme } = useAppTheme();
	const { appSub } = useAppPublishers();
	const { db } = useAppDb();
	const [Data, setData] = useState<Account[]>([]);
	const [Refreshing, setRefreshing] = useState(false);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function refresh() {
		try {
			setData(AccountService.getAll(db));
		} catch (e) {
			console.log('[ERROR]: failed to load account list', e);
			setData([]);
		}
	}

	// populate account list on load & refresh
	function onRefresh() {
		setRefreshing(true);
		refresh();
		setRefreshing(false);
	}

	useEffect(() => {
		refresh();
		appSub.subscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		return () => {
			appSub.unsubscribe(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED, refresh);
		};
	}, [db]);

	const SOFTWARE_ARRAY = [
		KNOWN_SOFTWARE.AKKOMA,
		KNOWN_SOFTWARE.CHERRYPICK,
		KNOWN_SOFTWARE.FIREFISH,
		KNOWN_SOFTWARE.MASTODON,
		KNOWN_SOFTWARE.MISSKEY,
		KNOWN_SOFTWARE.PLEROMA,
		KNOWN_SOFTWARE.SHARKEY,
		KNOWN_SOFTWARE.BLUESKY,
	];

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 1,
		updateQueryCache: () => {},
	});

	function onPressAddAccount() {
		router.navigate(APP_ROUTING_ENUM.SELECT_DRIVER);
	}

	return (
		<AppTopNavbar
			title={t(`topNav.secondary.manageAccounts`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<FlatList
				data={SOFTWARE_ARRAY}
				renderItem={({ item }) => (
					<AccountListForSoftware
						data={Data}
						software={item}
						onListChange={refresh}
					/>
				)}
				contentContainerStyle={{
					paddingHorizontal: 4,
					paddingTop: 54,
					backgroundColor: theme.palette.bg,
				}}
				ListFooterComponent={
					<View style={styles.footerContainer}>
						<Pressable
							onPress={onPressAddAccount}
							style={[
								styles.ctaButtonContainer,
								{
									backgroundColor: theme.primary.a0,
								},
							]}
						>
							<Text style={styles.ctaButtonText}>
								{t(`onboarding.addAccountButton`)}
							</Text>
						</Pressable>
					</View>
				}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
			/>
		</AppTopNavbar>
	);
}

export default SelectAccountStack;

const styles = StyleSheet.create({
	footerContainer: {
		marginHorizontal: 16,
		marginBottom: 48,
		marginTop: 72,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	ctaButtonContainer: {
		borderRadius: appDimensions.buttons.borderRadius,
		padding: 8,
		paddingHorizontal: 16,
	},
	ctaButtonText: {
		color: 'black',
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		fontSize: 16,
		textAlign: 'center',
	},
	tipText: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		textAlign: 'center',
		marginTop: 16,
		paddingHorizontal: 16,
		fontSize: 14,
	},
});
