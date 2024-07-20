import { memo, useEffect, useRef, useState } from 'react';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import ControlSegment from '../components/ControlSegment';
import { View } from 'react-native';

const DEFAULT = {
	remote: false,
	local: false,
};

const PublicTimelineController = memo(function Foo() {
	const FeedSelected = useRef(new Set(['all']));
	const [FeedQuery, setFeedQuery] = useState(DEFAULT);

	useEffect(() => {}, [FeedQuery]);

	function onAllSelected() {
		FeedSelected.current.clear();
		FeedSelected.current.add('all');
	}

	function onLocalSelected() {
		if (FeedSelected.current.has('all')) {
			FeedSelected.current.clear();
			FeedSelected.current.add('local');
		} else if (FeedSelected.current.has('remote')) {
			FeedSelected.current.clear();
			FeedSelected.current.add('all');
		} else {
			FeedSelected.current.add('local');
		}
	}

	function onRemoteSelected() {
		if (FeedSelected.current.has('all')) {
			FeedSelected.current.clear();
			FeedSelected.current.add('remote');
		} else if (FeedSelected.current.has('local')) {
			FeedSelected.current.clear();
			FeedSelected.current.add('all');
		} else {
			FeedSelected.current.add('remote');
		}
	}

	return (
		<View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 16,
				}}
			>
				Public Timeline
			</Text>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_THEME.COLOR_SCHEME_D_NORMAL,
					fontSize: 14,
					opacity: 0.75,
				}}
			>
				mastodon.social
			</Text>
			<ControlSegment
				label={'Show feed from:'}
				buttons={[
					{
						label: 'All',
						selected: true,
						onClick: () => {},
					},
					{
						label: 'Local',
						selected: false,
						onClick: () => {},
					},
					{
						label: 'Remote',
						selected: false,
						onClick: () => {},
					},
				]}
			/>

			<ControlSegment
				label={'More options:'}
				buttons={[
					{
						label: 'All',
						selected: true,
						onClick: () => {},
					},
					{
						label: 'Media Only',
						selected: false,
						onClick: () => {},
					},
				]}
			/>
		</View>
	);
});

export default PublicTimelineController;
