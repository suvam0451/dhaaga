import { Pressable, ScrollView, Text, View } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useDbListCollections } from '../../../database/queries/useDbCollectionQuery';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../styles/dimensions';
import { AccountCollection } from '../../../database/_schema';
import { AppText } from '../../../components/lib/Text';
import { AppCtaButton } from '../../../components/lib/Buttons';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';

type CollectionListing = {
	item: AccountCollection;
};

function CollectionListing({ item }: CollectionListing) {
	const { theme } = useAppTheme();

	function onPress() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.APP_FEATURE_COLLECTION,
			params: {
				id: item.id,
			},
		});
	}
	return (
		<Pressable
			style={{
				flexDirection: 'row',
				marginBottom: 16,
				alignItems: 'center',
				paddingRight: 4,
			}}
			onPress={onPress}
		>
			<View
				style={{
					padding: 16,
					borderWidth: 2,
					borderRadius: 12,
					borderColor: theme.secondary.a50,
				}}
			>
				<AppIcon id={'albums-outline'} size={24} color={theme.secondary.a20} />
			</View>
			<View style={{ marginLeft: 16, justifyContent: 'center' }}>
				<Text
					style={{
						color: theme.secondary.a0,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 18,
					}}
				>
					{item.alias}
				</Text>
				<Text
					style={{
						color: theme.secondary.a20,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
					}}
				>
					Local Only Not Synced
				</Text>
			</View>

			<View style={{ flexGrow: 1 }} />
			<AppIcon
				id={'chevron-right'}
				size={32}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				onPress={() => {}}
			/>
		</Pressable>
	);
}

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { data } = useDbListCollections();

	function onCollectionAdd() {}

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Collections'}
			translateY={translateY}
		>
			<ScrollView
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingHorizontal: 10,
				}}
			>
				<AppText.Special
					style={{ marginVertical: 24, color: theme.primary.a0 }}
				>
					Collections
				</AppText.Special>
				{data.map((o, i) => (
					<CollectionListing key={i} item={o} />
				))}
				<AppCtaButton onPress={onCollectionAdd} />
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;
