import { memo } from 'react';
import { APP_FONT } from '../../../../styles/AppTheme';
import { View, Text } from 'react-native';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import ControlSegment from '../components/ControlSegment';
import useTimelineOptions from '../states/useTimelineOptions';
import { AppInlineCheckbox } from '../../../lib/Checkboxes';
import { styles } from './_shared';

const UserTimelineController = memo(function Foo() {
	const { query } = useTimelineController();
	const {
		MediaOpt,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		updateQuery,
		HideReply,
		HideReblog,
	} = useTimelineOptions();

	function onClickHideReply() {
		HideReply.current = !HideReply.current;
		updateQuery();
	}

	function onClickHideReblog() {
		HideReblog.current = !HideReblog.current;
		updateQuery();
	}

	return (
		<View>
			<Text style={styles.timelineTypeText}>User Timeline</Text>
			<Text style={styles.timelineTargetText}>{query?.label}</Text>
			<ControlSegment
				label={'More options:'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: onMediaOptAllSelected,
					},
					{
						label: 'Media Only',
						lookupId: 'media-only',
						onClick: () => {
							onMediaOptSelected(0);
						},
					},
				]}
				hash={State}
				selection={MediaOpt}
			/>

			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					marginTop: 16,
					marginBottom: 4,
				}}
			>
				More Filters
			</Text>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<AppInlineCheckbox
					label={'Hide Replies'}
					checked={HideReply.current}
					onClick={onClickHideReply}
				/>
				<AppInlineCheckbox
					label={'Hide Reblogs'}
					checked={HideReblog.current}
					onClick={onClickHideReblog}
				/>
			</View>
		</View>
	);
});

export default UserTimelineController;
