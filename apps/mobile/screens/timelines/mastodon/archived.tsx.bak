import { useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { getCloser } from '../../../utils';
import Header from '../../../components/Header';
import { RestServices } from '@dhaaga/shared-provider-mastodon';
import { useQuery } from '@tanstack/react-query';
import StatusItem from '../../../components/common/status/StatusItem';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { StatusBar } from 'expo-status-bar';

const { diffClamp } = Animated;
const HIDDEN_SECTION_HEIGHT = 100;
const SHOWN_SECTION_HEIGHT = 50;

/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
	const clientCtx = useActivityPubRestClientContext();

	const restClient = useRef(null);

	function getHomeTimeline() {
		if (!clientCtx.client) {
			throw new Error('_client not initialized');
		}

		return RestServices.v1.timelines.getHomeTimeline(restClient.current);
	}

	// Queries
	const { data } = useQuery({
		queryKey: ['mastodon/timelines/index', restClient.current],
		queryFn: getHomeTimeline,
	});

	const ref = useRef(null);

	const scrollY = useRef(new Animated.Value(0));
	const scrollYClamped = diffClamp(
		scrollY.current,
		0,
		HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT,
	);

	const translateY = scrollYClamped.interpolate({
		inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
		outputRange: [0, -HIDDEN_SECTION_HEIGHT],
	});

	const translateYNumber = useRef();

	translateY.addListener(({ value }) => {
		translateYNumber.current = value;
	});

	const handleScroll = Animated.event(
		[
			{
				nativeEvent: {
					contentOffset: { y: scrollY.current },
				},
			},
		],
		{
			useNativeDriver: true,
		},
	);

	/**
	 * When scroll view has stopped moving,
	 * snap to the nearest section
	 * @param param0
	 */
	const handleSnap = ({ nativeEvent }) => {
		const offsetY = nativeEvent.contentOffset.y;
		if (
			!(
				translateYNumber.current === 0 ||
				translateYNumber.current === -HIDDEN_SECTION_HEIGHT
			)
		) {
			if (ref.current) {
				try {
					/**
					 * ScrollView --> scrollo ???
					 * FlatView --> scrollToOffset({offset: number}})
					 */
					ref.current.scrollTo({
						// applies only for flat list
						offset:
							getCloser(translateYNumber.current, -HIDDEN_SECTION_HEIGHT, 0) ===
							-HIDDEN_SECTION_HEIGHT
								? offsetY + HIDDEN_SECTION_HEIGHT
								: offsetY - HIDDEN_SECTION_HEIGHT,
					});
				} catch (e) {
					console.log('[WARN]: component is not a flat list');
				}
			}
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#1c1c1c" />
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<Header
					SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
					HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
				/>
			</Animated.View>
			<Animated.ScrollView
				contentContainerStyle={{
					paddingTop: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT,
				}}
				onScroll={handleScroll}
				ref={ref}
				// onMomentumScrollEnd={handleSnap}
				scrollEventThrottle={16}
			>
				{data && data.map((o, i) => <StatusItem key={i} />)}
			</Animated.ScrollView>
		</SafeAreaView>
	);
}

export default TimelineRenderer;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	subHeader: {
		height: SHOWN_SECTION_HEIGHT,
		width: '100%',
		paddingHorizontal: 10,
	},
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
});
