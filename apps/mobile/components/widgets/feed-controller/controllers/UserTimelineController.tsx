import { memo, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import ControlSegment from '../components/ControlSegment';
import useTimelineOptions from '../states/useTimelineOptions';
import { AppInlineCheckbox } from '../../../lib/Checkboxes';
import { styles } from './_shared';
import {
	useAppBottomSheet_Improved,
	useAppBottomSheet_TimelineReference,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';

const UserTimelineController = memo(function Foo() {
	const { endSessionSeed, stateId } = useAppBottomSheet_Improved();
	const { draft } = useAppBottomSheet_TimelineReference();
	const {
		MediaOpt,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		HideReply,
		HideReblog,
		updateLocalState,
		broadcastChanges,
	} = useTimelineOptions();

	function onClickHideReply() {
		HideReply.current = !HideReply.current;
		updateLocalState();
	}

	function onClickHideReblog() {
		HideReblog.current = !HideReblog.current;
		updateLocalState();
	}

	const endSessionSeedRef = useRef(null);
	const stateIdRef = useRef(null);
	useEffect(() => {
		console.log('reviewing changes to submit', stateId, endSessionSeed);
		if (stateIdRef.current && stateIdRef.current === stateId) {
			if (
				endSessionSeedRef.current &&
				endSessionSeedRef.current !== endSessionSeed
			) {
				broadcastChanges();
			}
		} else {
			stateIdRef.current = stateId;
			endSessionSeedRef.current = endSessionSeed;
		}
	}, [stateId, endSessionSeed]);

	const { theme } = useAppTheme();

	return (
		<View>
			<Text
				style={[
					styles.timelineTypeText,
					{
						color: theme.primary.a10,
					},
				]}
			>
				User Timeline
			</Text>
			<Text
				style={[
					styles.timelineTargetText,
					{
						color: theme.complementary.a0,
					},
				]}
			>
				{draft?.query?.label}
			</Text>
			<ControlSegment
				label={'Timeline Options'}
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
				style={[
					styles.controlSectionLabel,
					{
						color: theme.secondary.a20,
					},
				]}
			>
				Extra Filters
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
