import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useMemo, useRef } from 'react';
import useSocialHub from '../../../states/useSocialHub';
import { Profile } from '../../../database/_schema';

type SocialHubProps = {
	profileId: string;
};

/**
 * The last tab of the Social Hub
 * is always a UI to add a new profile
 */
function SocialHubTabAdd() {
	return <View />;
}

type SocialHubTabProps = {
	profile: Profile;
};

/**
 * Tabs in the Social Hub interface
 * represent a unique profile each
 */
function SocialHubTab({}: SocialHubTabProps) {
	return <View />;
}

function SocialHub({ profileId }: SocialHubProps) {
	const ref = useRef<PagerView>(null);

	const { data, onPageScroll, index } = useSocialHub();

	function onPageSelected(e: any) {
		const { offset, position } = e.nativeEvent;
		const newIndex = Math.round(position + offset);
		// setIndex(newIndex);
	}

	const Component = useMemo(() => {
		if (index > data.length) {
			return <SocialHubTabAdd />;
		}
		return <SocialHubTab profile={data[index]} />;
	}, [index]);

	return (
		<View>
			<PagerView
				ref={ref}
				scrollEnabled={true}
				style={styles.pagerView}
				initialPage={index}
				onPageScroll={onPageSelected}
			></PagerView>
		</View>
	);
}

export default SocialHub;

const styles = StyleSheet.create({
	pagerView: {
		flex: 1,
	},
});
