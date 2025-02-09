import { ScrollView, StyleSheet, View } from 'react-native';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../components/shared/topnavbar/AppTabLandingNavbar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import AddAccountPresenter from '../onboarding/presenters/AddAccountPresenter';
import {
	useAppAcct,
	useAppBottomSheet,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_ROUTING_ENUM } from '../../utils/route-list';
import { AppText } from '../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import { appDimensions } from '../../styles/dimensions';
import QuickPost from './components/QuickPost';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../types/app.types';
import { AppIcon } from '../../components/lib/Icon';
import { APP_BOTTOM_SHEET_ENUM } from '../../states/_global';

const MARGON_BOTTOM = appDimensions.timelines.sectionBottomMargin;

function ComposerLandingPage() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { show, setCtx } = useAppBottomSheet();
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

	const modules = [
		{
			title: t(`composer.landing.tComposeFull`),
			desc: t(`composer.landing.dComposeFull`, {
				returnObjects: true,
			}) as string[],
			bgIcon: (
				<Ionicons name="create-outline" size={64} color={theme.secondary.a30} />
			),
		},
		{
			title: t(`composer.landing.tComposePoll`),
			desc: t(`composer.landing.dComposePoll`, {
				returnObjects: true,
			}) as string[],
			bgIcon: (
				<MaterialCommunityIcons
					name="poll"
					size={64}
					color={theme.secondary.a30}
				/>
			),
		},
		{
			title: t(`composer.landing.tViewScheduled`),
			desc: t(`composer.landing.dViewScheduled`, {
				returnObjects: true,
			}) as string[],
			bgIcon: (
				<AppIcon
					id="time-outline"
					size={64}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				/>
			),
		},
		{
			title: t(`composer.landing.tViewDrafts`),
			desc: t(`composer.landing.dViewDrafts`, {
				returnObjects: true,
			}) as string[],
			bgIcon: (
				<AppIcon
					id="save"
					size={64}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				/>
			),
		},
	];

	if (!acct) return <AddAccountPresenter tab={APP_LANDING_PAGE_TYPE.COMPOSE} />;

	function onQuickPost() {
		setCtx({
			uuid: null,
		});
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<ScrollView
			style={{
				backgroundColor: theme.palette.bg,
			}}
		>
			<View style={{ minHeight: '100%' }}>
				<View style={{ flexGrow: 1 }}>
					<AppTabLandingNavbar
						type={APP_LANDING_PAGE_TYPE.COMPOSE}
						menuItems={[
							{
								iconId: 'user-guide',
								onPress: () => {
									router.navigate(APP_ROUTING_ENUM.GUIDE_COMPOSER);
								},
							},
						]}
					/>
					<View style={style.root}>
						<View style={{ flexGrow: 1 }}>
							{modules.map((module, i) => (
								<View
									key={i}
									style={{
										borderRadius: 16,
										backgroundColor: theme.background.a20,
										padding: 16,
										marginBottom: 16,
										marginHorizontal: 10,
										position: 'relative',
									}}
								>
									<AppText.SemiBold
										style={{
											color: theme.complementary.a0,
											fontSize: 20,
											marginBottom: MARGON_BOTTOM,
										}}
									>
										{module.title}
									</AppText.SemiBold>
									<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
										{module.desc.join(' • ')}
									</AppText.Medium>
									<View
										style={{
											position: 'absolute',
											right: 12,
											bottom: 12,
										}}
									>
										{module.bgIcon}
									</View>
								</View>
							))}
						</View>
					</View>
				</View>
				<QuickPost
					onPress={onQuickPost}
					style={{
						marginBottom: 64,
					}}
				/>
			</View>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	root: {
		marginTop: 28,
	},
});

export default ComposerLandingPage;
