import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../shared/topnavbar/AppTabLandingNavbar';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import AppNoAccount from '../../../error-screen/AppNoAccount';
import {
	useAppBottomSheet_Improved,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../dhaaga-bottom-sheet/Core';

function QuickPost() {
	const { show, setCtx } = useAppBottomSheet_Improved();
	const { theme } = useAppTheme();

	function onPressQuickPost() {
		setCtx({
			uuid: null,
		});
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<View
			style={{
				paddingHorizontal: 10,
				marginTop: 'auto',
			}}
		>
			<Pressable
				style={{
					backgroundColor: theme.primary.a0,
					alignSelf: 'center',
					minWidth: 128,
					maxWidth: 244,
					padding: 8,
					borderRadius: 8,
				}}
				onPress={onPressQuickPost}
			>
				<Text
					style={{
						color: 'black',
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						fontSize: 18,
						textAlign: 'center',
					}}
				>
					Quick Post
				</Text>
			</Pressable>
			{/*<View style={{ flexDirection: 'row' }}>*/}
			{/*	<View style={{ flexGrow: 1, flex: 1 }}>*/}
			{/*		<Text style={{ color: theme.secondary.a10, fontSize: 20 }}>*/}
			{/*			Quick Post*/}
			{/*		</Text>*/}
			{/*	</View>*/}
			{/*	<View*/}
			{/*		style={{*/}
			{/*			backgroundColor: theme.primary.a0,*/}
			{/*			padding: 8,*/}
			{/*			borderRadius: 8,*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<Text*/}
			{/*			style={{*/}
			{/*				color: 'black',*/}
			{/*				fontFamily: APP_FONTS.INTER_600_SEMIBOLD,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			Publish*/}
			{/*		</Text>*/}
			{/*	</View>*/}
			{/*</View>*/}

			{/*<Text*/}
			{/*	style={{*/}
			{/*		color: theme.secondary.a10,*/}
			{/*		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,*/}
			{/*	}}*/}
			{/*>*/}
			{/*	{acct.displayName}*/}
			{/*</Text>*/}
			{/*<TextInput*/}
			{/*	multiline={true}*/}
			{/*	placeholder={'What is on your mind?'}*/}
			{/*	placeholderTextColor={theme.secondary.a40}*/}
			{/*	style={{*/}
			{/*		textDecorationLine: 'none',*/}
			{/*		textDecorationStyle: undefined,*/}
			{/*		width: '100%',*/}
			{/*		height: 48,*/}
			{/*		paddingVertical: 16,*/}
			{/*		paddingLeft: 4,*/}
			{/*		// color: APP_FONT.MONTSERRAT_BODY,*/}
			{/*		fontSize: 16,*/}
			{/*		paddingBottom: 13,*/}
			{/*	}}*/}
			{/*/>*/}
			{/*<View style={{ flexDirection: 'row' }}>*/}
			{/*	<View style={{ width: 32 }}>*/}
			{/*		<Ionicons*/}
			{/*			name="warning-outline"*/}
			{/*			size={24}*/}
			{/*			color={theme.secondary.a20}*/}
			{/*		/>*/}
			{/*	</View>*/}

			{/*	<View style={{ width: 32 }}>*/}
			{/*		<Ionicons*/}
			{/*			name="images-outline"*/}
			{/*			size={24}*/}
			{/*			color={theme.secondary.a20}*/}
			{/*		/>*/}
			{/*	</View>*/}
			{/*</View>*/}
		</View>
	);
}

function AppTabLanding() {
	const { theme, acct } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			acct: o.acct,
		})),
	);

	const modules = [
		{
			title: 'Create a Post',
			desc: ['Longer Posts', 'More Options'],
			bgIcon: (
				<Ionicons name="create-outline" size={64} color={theme.secondary.a30} />
			),
		},
		{
			title: 'Create a Poll',
			desc: ['<Not Implemented>'],
			bgIcon: (
				<MaterialCommunityIcons
					name="poll"
					size={64}
					color={theme.secondary.a30}
				/>
			),
		},
		{
			title: 'View Published Posts',
			desc: ['<Not Implemented>'],
			bgIcon: (
				<Ionicons name="time-outline" size={64} color={theme.secondary.a30} />
			),
		},
		{
			title: 'View Drafts',
			desc: ['<Not Implemented>'],
			bgIcon: (
				<Ionicons name="save-outline" size={64} color={theme.secondary.a30} />
			),
		},
	];

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.COMPOSE} />;

	return (
		<ScrollView
			style={{
				height: '100%',
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
									router.navigate('/apps/user-guide');
								},
							},
						]}
					/>
					<View style={style.rootContainer}>
						<View style={{ flexGrow: 1 }}>
							{modules.map((module, i) => (
								<View
									key={i}
									style={{
										borderRadius: 16,
										backgroundColor: theme.palette.menubar,
										padding: 16,
										marginBottom: 16,
										marginHorizontal: 10,
										position: 'relative',
									}}
								>
									<Text
										style={{
											color: theme.complementary.a0,
											fontSize: 20,
											fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
										}}
									>
										{module.title}
									</Text>
									<Text
										style={{
											color: theme.textColor.medium,
											marginTop: 8,
										}}
									>
										{module.desc.join(' • ')}
									</Text>
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

						{/*TODO: move these apps to the Social Hub*/}
						{/*<AppListingBookmarkGallery />*/}
						{/*<View style={style.appFeaturesGridRow}>*/}
						{/*	<AppFeatureLargeGridItem*/}
						{/*		label={'Known Servers'}*/}
						{/*		link={'/apps/known-servers'}*/}
						{/*		Icon={*/}
						{/*			<FontAwesome6*/}
						{/*				name="server"*/}
						{/*				size={24}*/}
						{/*				color={APP_FONT.MONTSERRAT_BODY}*/}
						{/*			/>*/}
						{/*		}*/}
						{/*		alignment={'left'}*/}
						{/*	/>*/}
						{/*</View>*/}
					</View>
				</View>
				<View style={{ marginBottom: 64 }}>
					<QuickPost />
				</View>
			</View>
		</ScrollView>
	);
}

const style = StyleSheet.create({
	rootContainer: {
		marginTop: 28,
	},
});

export default AppTabLanding;
