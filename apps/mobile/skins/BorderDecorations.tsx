import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import ChristmasMistleToe from '#/skins/christmas/ChristmasMistleToe';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import { NativeTextSemiBold } from '#/ui/NativeText';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

export function QuotedPostBorderDecorations({ children }: { children: any }) {
	const { theme } = useAppTheme();
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: SECTION_MARGIN_BOTTOM,
				}}
			>
				<AppIcon id={'quote'} size={14} color={theme.complementary.a0} />
				<NativeTextSemiBold
					style={{
						color: theme.complementary.a0,
						marginLeft: 4,
					}}
				>
					Quoted this Post
				</NativeTextSemiBold>
			</View>
			<View style={styles.inner}>
				<View>
					<ChristmasMistleToe
						style={{
							position: 'absolute',
							right: -16,
							top: -10,
							transform: [{ rotate: '145deg' }],
						}}
					/>
				</View>
				{children}
			</View>
		</View>
	);
}

export function AttachedLinkBorderDecorations({ children }: { children: any }) {
	const { theme } = useAppTheme();
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: SECTION_MARGIN_BOTTOM,
				}}
			>
				<AppIcon id={'quote'} size={14} color={theme.complementary.a0} />
				<NativeTextSemiBold
					style={{
						color: theme.complementary.a0,
						marginLeft: 4,
					}}
				>
					Shared this Link
				</NativeTextSemiBold>
			</View>
			<View style={styles.inner}>
				<View>
					<ChristmasMistleToe
						style={{
							position: 'absolute',
							right: -2,
							top: 2,
							transform: [{ rotate: '145deg' }],
						}}
					/>
				</View>
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	inner: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderWidth: 3,
		borderRadius: 6,
		borderColor: '#0d7a00',
		borderStyle: 'dashed',
		marginBottom: SECTION_MARGIN_BOTTOM,
	},
});
