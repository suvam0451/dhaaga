import { View, Animated, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import NavBar_Feed from '#/components/shared/topnavbar/NavBar_Feed';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

function IdleTimelineView() {
	const { theme } = useAppTheme();
	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
	});

	return (
		<View
			style={{ flex: 1, backgroundColor: theme.background.a0, paddingTop: 52 }}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<NavBar_Feed animatedStyle={{}} />
			</Animated.View>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'No Timeline Selected'}
				errorDescription={
					'You can pin and access various types of timelines from your personalised hub.'
				}
			/>
			<View style={{ marginTop: 32 }}>
				<AppButtonVariantA
					label={'Go There'}
					loading={false}
					onClick={() => {
						router.navigate('/');
					}}
				/>
			</View>
		</View>
	);
}

export default IdleTimelineView;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
		position: 'relative',
	},
});
