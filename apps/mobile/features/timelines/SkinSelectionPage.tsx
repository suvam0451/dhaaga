import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';
import { appDimensions } from '#/styles/dimensions';
import { NativeTextBold } from '#/ui/NativeText';
import { AppDividerSoft } from '#/ui/Divider';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '#/states/global/hooks';

function SkinSelectionPage() {
	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();
	const { setSkin } = useAppTheme();

	const items = [
		{
			id: 'default',
			name: 'Default',
			statusBar: 'dark-content',
			bg: '#121212',
			bgFinal: '#2b2b2b',
			primary: '#e7cf8e',
			complementary: '#97b0f6',
			text0: '#f5f5f5',
			text10: '#d7d7d7',
			text20: '#b9b9b9',
			text30: '#9c9c9c',
			text40: '#808080',
			text50: '#656565',
			isDarkMode: true,
			hasCustomTheme: false,
			hasTransparency: false,
			hasIconPack: false,
		},
		{
			id: 'christmas',
			name: 'Christmas',
			statusBar: 'dark-content',
			bg: '#eaebdb', // #eec665, #eaeada
			bgFinal: '#e9cc89', // eec665
			primary: '#1b8d27',
			complementary: '#B11226',
			text0: '#1f341c', // #91954a, 56563c
			text10: '#293a22',
			text20: '#334027',
			text30: '#3c452d',
			text40: '#464b32',
			text50: '#305633',
			isDarkMode: false,
			hasSkin: true,
			hasCustomTheme: true,
			hasTransparency: false,
			hasIconPack: true,
		},
		{
			id: 'white_album',
			name: 'White Album',
			statusBar: 'light-content',
			description: 'An ode to the love',
			bg: '#fffdf8', // #eec665, #eaeada
			bgFinal: '#73acbf',
			primary: '#f9ba4f',
			complementary: '#9f4c5d',
			text0: '#134358', // #91954a, 56563c
			text10: '#15487F',
			text20: '#174D66',
			text30: '#19526D',
			text40: '#1B5774',
			text50: '#1B5D79',
			isDarkMode: false,
			hasCustomTheme: false,
			hasTransparency: false,
			hasIconPack: false,
		},
		{
			id: 'white_album_2',
			name: 'White Album 2',
			statusBar: 'light-content',
			description: 'An ode to the love',
			bg: '#fffdf8', // fffdf8
			bgFinal: '#9EC5D1', // 73acbf
			primary: '#48599D', // 814B0E, e8922e
			complementary: '#A06466', // 983825
			text0: '#1B5D79', // 134358
			text10: '#1B5774', // 15487F
			text20: '#19526D', // 174D66
			text30: '#174D66', // 19526D
			text40: '#15487F', // 1B5774
			text50: '#134358', // 1B5D79
			isDarkMode: false,
			hasSkin: true,
			hasTransparency: true,
			hasIconPack: false,
		},
		{
			id: 'kataware_doki',
			name: 'Kataware Doki',
			statusBar: 'dark-content',
			description: 'A warm, golden glow',
			bg: '#4f0b3f',
			bgFinal: '#853963',
			primary: '#fcaf88',
			complementary: '#90CEEE',
			text0: '#fef1b7', // #91954a, 56563c
			text10: '#f9deb2',
			text20: '#efc7b1',
			text30: '#d9a4b2',
			text40: '#b881a1',
			text50: '#9d7290',
			isDarkMode: true,
			hasCustomTheme: true,
			hasTransparency: false,
			hasIconPack: false,
		},
		{
			id: 'sunset',
			name: 'Sunset',
			description: 'A warm, golden glow',
			bg: '#fcfb9b',
			bgFinal: '#eec665',
			primary: '#32455b',
			complementary: '#eabc7a',
			text0: '#91954a', // #91954a, 56563c
			text10: '#505138',
			text20: '#4A4C34',
			text30: '#44472F',
			text40: '#3E4230',
			text50: '#2f2e27',
			isDarkMode: false,
			hasCustomTheme: false,
			hasTransparency: false,
			hasIconPack: false,
		},
	];

	function onSelect(id: string) {
		setSkin(id);
	}

	return (
		<WithBackgroundSkin>
			<NavBar_Simple label={'Skins'} animatedStyle={animatedStyle} />
			<FlatList
				data={items}
				renderItem={({ item }) => (
					<TouchableOpacity
						delayPressIn={200}
						onPress={() => onSelect(item.id)}
					>
						<LinearGradient
							colors={[item.bg, item.bgFinal]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }} // diagonal gradient
							style={{
								marginHorizontal: 6,
								paddingHorizontal: 10,
								paddingVertical: 10,
								borderRadius: 12,
							}}
						>
							<View style={{ flexDirection: 'row' }}>
								<NativeTextBold
									style={{
										flex: 1,
										fontSize: 24,
										marginVertical: 'auto',
										color: item.text0,
									}}
								>
									{item.name}
								</NativeTextBold>
								<View
									style={{
										flexDirection: 'row',
										padding: 8,
										paddingVertical: 4,
										borderRadius: 16,
									}}
								>
									<View
										style={{
											backgroundColor: item.primary,
											width: 24,
											borderTopStartRadius: 8,
											borderBottomStartRadius: 8,
										}}
									></View>
									<View
										style={{
											backgroundColor: item.complementary,
											width: 24,
											borderTopEndRadius: 8,
											borderBottomEndRadius: 8,
										}}
									></View>

									<View style={styles.row}>
										<View
											style={[
												styles.box,
												styles.firstItem,
												{ backgroundColor: item.text0 },
											]}
										/>
										<View
											style={[styles.box, { backgroundColor: item.text10 }]}
										/>
										<View
											style={[styles.box, { backgroundColor: item.text20 }]}
										/>
										<View
											style={[styles.box, { backgroundColor: item.text30 }]}
										/>
										<View
											style={[styles.box, { backgroundColor: item.text40 }]}
										/>
										<View
											style={[
												styles.box,
												styles.lastItem,
												{ backgroundColor: item.text50 },
											]}
										/>
									</View>
								</View>
							</View>
							<View style={{ flexDirection: 'row' }}>
								{item.hasSkin ? (
									<NativeTextBold style={{ color: item.text20 }}>
										Wallpaper
									</NativeTextBold>
								) : (
									<View />
								)}
								{item.hasTransparency ? (
									<NativeTextBold style={{ color: item.text0 }}>
										{` • Has Transparency`}
									</NativeTextBold>
								) : (
									<View />
								)}
								{item.hasIconPack ? (
									<NativeTextBold style={{ color: item.text0 }}>
										{` • Custom Icons`}
									</NativeTextBold>
								) : (
									<View />
								)}
							</View>
						</LinearGradient>
					</TouchableOpacity>
				)}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 8,
				}}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 8 }} />
				)}
			/>
		</WithBackgroundSkin>
	);
}

export default SkinSelectionPage;

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		paddingHorizontal: 2,
		overflow: 'hidden',
		height: 36,
		width: 90,
		paddingLeft: 10,
	},
	box: {
		width: 12,
	},
	firstItem: {
		borderTopStartRadius: 8,
		borderBottomStartRadius: 8,
	},
	lastItem: {
		borderTopEndRadius: 8,
		borderBottomEndRadius: 8,
	},
});
