import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import ChristmasMistleToe from '#/skins/christmas/ChristmasMistleToe';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import { NativeTextBold } from '#/ui/NativeText';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

export function ThemedQuotedPostOrnament({ children }: { children: any }) {
	const { theme } = useAppTheme();
	switch (theme.id) {
		case 'christmas':
		case 'winter':
		case 'white_album':
			return (
				<View>
					<View style={styles.container}>
						<AppIcon id={'quote'} size={14} color={theme.complementary} />
						<NativeTextBold
							style={{
								color: theme.complementary,
								marginLeft: 4,
							}}
						>
							Quoted this Post
						</NativeTextBold>
					</View>
					<View style={styles.inner}>
						<View>
							<ChristmasMistleToe style={styles.mistletoeTopRight} />
						</View>
						{children}
					</View>
				</View>
			);
		default:
			return (
				<View>
					<View style={styles.container}>
						<AppIcon id={'quote'} size={14} color={theme.complementary} />
						<NativeTextBold
							style={{
								color: theme.complementary,
								marginLeft: 4,
							}}
						>
							Quoted this Post
						</NativeTextBold>
					</View>
					<View
						style={[
							styles.inner,
							{
								borderColor: theme.complementary,
								borderWidth: 2.5,
							},
						]}
					>
						{children}
					</View>
				</View>
			);
	}
}

export function ThemedLinkAttachmentOrnament({ children }: { children: any }) {
	const { theme } = useAppTheme();

	// <View style={styles.container}>
	// 	<AppIcon id={'quote'} size={14} color={theme.complementary} />
	// 	<NativeTextBold
	// 		style={{
	// 			color: theme.secondary.a20,
	// 			marginLeft: 4,
	// 		}}
	// 	>
	// 		Shared this Link
	// 	</NativeTextBold>
	// </View>

	switch (theme.id) {
		case 'christmas':
		case 'winter':
		case 'white_album':
			return (
				<View style={styles.inner}>
					<ChristmasMistleToe style={styles.mistletoeBottomRight} />
					{children}
				</View>
			);
		default:
			return (
				<View
					style={[
						styles.inner,
						{
							borderColor: theme.secondary.a50,
							borderWidth: 2.5,
						},
					]}
				>
					{children}
				</View>
			);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: SECTION_MARGIN_BOTTOM,
	},
	inner: {
		paddingHorizontal: 4,
		paddingVertical: 4,
		borderWidth: 3,
		borderRadius: 6,
		borderColor: '#0d7a00',
		borderStyle: 'dashed',
		position: 'relative',
	},
	mistletoeTopRight: {
		position: 'absolute',
		right: -8,
		top: -10,
		transform: [{ rotate: '145deg' }],
	},
	mistletoeBottomRight: {
		position: 'absolute',
		right: -4,
		top: '100%',
		marginTop: -36,
		zIndex: 5,
		transform: [{ rotate: '-135deg' }],
	},
});
