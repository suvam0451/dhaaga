import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import WithScrollOnRevealContext from '../states/useScrollOnReveal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Divider } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavouritesScreenHomePageDefaultTutorial from '../components/tutorials/screens/favourites/HomePage';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MyFollowings from '../components/screens/apps/stack/MyFollowings';
import MyFollowers from '../components/screens/apps/stack/MyFollowers';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';
import { APP_FONT, APP_THEME } from '../styles/AppTheme';
import { APP_FONTS } from '../styles/AppFonts';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useActivityPubRestClientContext } from '../states/useActivityPubRestClient';
import { useObject } from '@realm/react';
import { Account } from '../entities/account.entity';
import {
	BookmarkNeverSyncedPrompt,
	BookmarkSyncedPrompt,
} from '../components/screens/apps/stack/BookmarkPortalStack';

type FavouritesScreenNavigationItemIconOnlyProps = {
	icon: any;
	onPress: () => void;
	disabled?: boolean;
	borderColor?: string;
};

type FavouritesScreenNavigationItemProps = {
	text: string;
	icon: any;
	onPress: () => void;
	disabled?: boolean;
};

function FavouritesScreenNavigationItemIconOnly({
	icon,
	onPress,
	borderColor,
}: FavouritesScreenNavigationItemIconOnlyProps) {
	return (
		<View style={{ flex: 1, paddingHorizontal: 4 }}>
			<Button
				type={'clear'}
				buttonStyle={{
					borderWidth: 1,
					borderColor: borderColor || '#333333',
					borderRadius: 8,
					padding: 4,
					backgroundColor: '#1E1E1E',
				}}
				onPress={onPress}
			>
				{icon}
			</Button>
		</View>
	);
}

function FavouritesScreenNavigationItem({
	text,
	icon,
	onPress,
	disabled,
}: FavouritesScreenNavigationItemProps) {
	return (
		<View style={{ flex: 1, paddingHorizontal: 4 }}>
			<Button
				type={'clear'}
				buttonStyle={{
					borderWidth: 1,
					borderColor: '#333333',
					borderRadius: 8,
					padding: 8,
					backgroundColor: '#1E1E1E',
				}}
				onPress={onPress}
			>
				<Text
					style={{
						color: disabled ? APP_FONT.DISABLED : APP_FONT.MONTSERRAT_BODY,
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
					}}
				>
					{text}
				</Text>
				<View style={{ marginLeft: 6 }}>{icon}</View>
			</Button>
		</View>
	);
}

function ActionableSection() {
	const navigation = useNavigation<any>();

	return (
		<View>
			<View
				style={{
					borderWidth: 1,
					borderColor: '#ffffff30',
					borderRadius: 8,
					padding: 8,
					marginVertical: 8,
					marginHorizontal: 8,
				}}
			>
				<View
					style={{
						marginHorizontal: 8,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						Saved by You
					</Text>
					<FontAwesome
						name="chevron-down"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>

				<Divider style={{ opacity: 0.3, marginVertical: 8 }} />
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							router.navigate('/favourites/likes-classic');
						}}
						icon={<Ionicons name="star-outline" size={24} color={'#888'} />}
					/>

					<View
						style={{
							flex: 1,
							paddingHorizontal: 4,
						}}
					>
						<Button
							type={'clear'}
							buttonStyle={{
								borderWidth: 1,
								borderColor: '#333333',
								borderRadius: 8,
								padding: 4,
								backgroundColor: '#1E1E1E',
							}}
							onPress={() => {
								router.navigate('/favourites/bookmark-portal');
							}}
						>
							<FontAwesome6
								name="bookmark"
								size={24}
								color={'#888'}
								style={{
									opacity: 0.87,
								}}
							/>
						</Button>
					</View>

					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							console.log('[INFO]: user wants to see their mute list');
						}}
						icon={<FontAwesome6 name="hashtag" size={24} color={'#888'} />}
					/>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							console.log('[INFO]: user wants to see their mute list');
						}}
						icon={<FontAwesome color={'#888'} name="photo" size={24} />}
					/>
				</View>
			</View>
			<View
				style={{
					borderWidth: 1,
					borderColor: '#ffffff30',
					borderRadius: 8,
					padding: 8,
					marginHorizontal: 8,
				}}
			>
				<View
					style={{
						marginHorizontal: 8,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						Your Network
					</Text>
					<FontAwesome
						name="chevron-down"
						size={24}
						color="#fff"
						style={{ opacity: 0.6 }}
					/>
				</View>
				<Divider style={{ opacity: 0.3, marginVertical: 8 }} />
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						paddingHorizontal: 8,
						marginVertical: 8,
					}}
				>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							navigation.push('MyFollowers');
						}}
						icon={
							<SimpleLineIcons name="user-following" size={24} color="#888" />
						}
					/>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							navigation.push('MyFollowings');
						}}
						icon={<SimpleLineIcons name="user-follow" size={24} color="#888" />}
					/>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							console.log('[INFO]: user wants to see their mute list');
						}}
						icon={
							<Ionicons
								style={{ marginLeft: 4 }}
								name="volume-mute"
								size={24}
								color={'#888'}
							/>
						}
					/>
					<FavouritesScreenNavigationItemIconOnly
						onPress={() => {
							console.log('[INFO]: user wants to see their block list');
						}}
						icon={<MaterialIcons name="block" size={24} color={'#888'} />}
					/>
				</View>
			</View>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function FavouritesScreenTabSetup() {
	const { PrimaryAcctPtr } = useActivityPubRestClientContext();
	const acct = useObject(Account, PrimaryAcctPtr.current);

	const BOOKMARK_LAST_SYNCED_AT = acct?.isValid()
		? acct?.bookmarksLastSyncedAt
		: null;

	return (
		<View
			style={{
				display: 'flex',
				width: '100%',
				backgroundColor: '#121212',
				height: '100%',
				justifyContent: 'flex-end',
				paddingBottom: 8,
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<FavouritesScreenHomePageDefaultTutorial />
			</View>
			<View style={style.sectionContainer}>
				<Text style={style.texStyle}>
					Bookmark Gallery
					<MaterialCommunityIcons
						name="beta"
						size={24}
						color={APP_THEME.COLOR_SCHEME_D_NORMAL}
					/>
				</Text>

				{!BOOKMARK_LAST_SYNCED_AT ? (
					<BookmarkNeverSyncedPrompt />
				) : (
					<BookmarkSyncedPrompt />
				)}
			</View>
			<View>
				<ActionableSection />
			</View>
		</View>
	);
}

function WithStackNavigation() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack.Navigator
				initialRouteName={'FavouritesModuleLandingPage'}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen
					name="FavouritesModuleLandingPage"
					component={FavouritesScreenTabSetup}
				/>
				<Stack.Screen name={'MyFollowings'} component={MyFollowings} />
				<Stack.Screen name={'MyFollowers'} component={MyFollowers} />
			</Stack.Navigator>
		</WithGorhomBottomSheetContext>
	);
}

function FavouritesScreen() {
	return (
		<View style={{ height: '100%' }}>
			<WithScrollOnRevealContext>
				<WithStackNavigation />
			</WithScrollOnRevealContext>
		</View>
	);
}

const style = StyleSheet.create({
	sectionContainer: {
		borderWidth: 2,
		borderColor: '#383838',
		borderRadius: 8,
		padding: 8,
		margin: 8,
	},
	texStyle: {
		textAlign: 'center',
		fontFamily: 'Montserrat-Bold',
		fontSize: 20,
		color: APP_FONT.MONTSERRAT_BODY,
	},
});

export default FavouritesScreen;
